from flask import Blueprint, Flask
from helpers import time_cache
import requests

app = Flask(__name__)
tauri_releases_bp = Blueprint('releases', __name__, url_prefix='/releases', template_folder='blueprints/tauri_releases/templates')

PACHTOP_REPO = 'pacholoamit/pachtop'

PLATFORMS = [ # platform, extension
    (('linux-x86_64',), 'amd64.AppImage.tar.gz'),
    (('darwin-x86_64', 'darwin-aarch64'), 'app.tar.gz'),
    (('windows-x86_64',), 'x64_en-US.msi.zip'),
]

@time_cache(60 * 5)  # every 5 minutes
def get_latest_gh_release(repo) -> dict:
    github_latest_release_url = f'https://api.github.com/repos/{repo}/releases/latest'
    try:
        release = requests.get(github_latest_release_url).json()
    except requests.RequestException:
        return {}
    release_response = {
        'version': release['tag_name'],
        'notes': release['body'].removesuffix('See the assets to download this version and install.').rstrip('\r\n '),
        'pub_date': release['published_at'],
        'platforms': {}}
    for asset in release.get('assets', []):
        for for_platforms, extension in PLATFORMS:
            if asset['name'].endswith(extension):
                for platform in for_platforms:
                    release_response['platforms'][platform] = {**release_response['platforms'].get(platform, {}), 'url': asset['browser_download_url']}
            elif asset['name'].endswith(f'{extension}.sig'):
                try:
                    sig = requests.get(asset['browser_download_url']).text
                except requests.RequestException:
                    sig = ''
                for platform in for_platforms:
                    release_response['platforms'][platform] = {**release_response['platforms'].get(platform, {}), 'signature': sig}
    return release_response


@tauri_releases_bp.route('/pachtop/<platform>/<current_version>')
def pachtop_desktop_api(platform, current_version):
    latest_release = get_latest_gh_release(PACHTOP_REPO)
    if not latest_release:
        # GH API request failed in get_latest_release for GKD
        # TODO: Push Discord or Element notification (max once) if request failed
        return '', 204
    try:
        # version checks
        latest_version = latest_release['version']
        latest_maj, latest_min, latest_patch = latest_version.lstrip('v').split('.')
        cur_maj, cur_min, cur_patch = current_version.lstrip('v').split('.')
        if cur_maj == latest_maj and cur_min == latest_min and cur_patch == latest_patch:
            raise ValueError
        # NOTE: here you may want to check the current_version or platform (see README.md)
    except ValueError:
        return '', 204
    return latest_release


@tauri_releases_bp.route('/')
def pachtop_desktop_page():
    # TODO: Download Links Page
    return '', 404



if __name__ == '__main__':
    app.register_blueprint(tauri_releases_bp)
    app.run(debug=False)
    