export default function CreateUser({ callback, buttonText }) {
  async function handleCreate(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const name = event.target[1].value;
    const password = event.target[2].value;
    const age = event.target[3].value;
    const height = event.target[4].value;
    event.target.reset();
    if (
      !email.trim() ||
      !name.trim() ||
      !password.trim() ||
      !age.trim() ||
      !height.trim()
    ) {
      return;
    }

    await callback({ email, name, password, age, height });
  }

  return (
    <form onSubmit={async (event) => await handleCreate(event)}>
      <label htmlFor="email">Email</label>
      <input type="email" placeholder="Email" required />
      <label htmlFor="name">Name</label>
      <input type="text" placeholder="Name" required />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        required
        minLength="1"
        maxLength="8"
      />
      <label htmlFor="age">Age</label>
      <input type="number" placeholder="22" required min="1" max="150" />
      <label htmlFor="height">Height</label>
      <input type="number" placeholder="182" required min="1" max="250" />
      <button type="submit">{buttonText}</button>
    </form>
  );
}
