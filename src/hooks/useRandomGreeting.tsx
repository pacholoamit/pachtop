const useRandomGreeting = (name: string) => {
  const greetings = [
    `Glad to see you back! ${name}`,
    `Welcome back, ${name}!`,
    `Hello, ${name}!`,
    `Good to see you again, ${name}!`,
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
};

export default useRandomGreeting;
