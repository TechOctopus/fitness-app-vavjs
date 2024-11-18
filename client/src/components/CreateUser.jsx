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
    )
      return;

    await callback({ email, name, password, age, height });
  }

  return (
    <form onSubmit={async (event) => await handleCreate(event)}>
      <label htmlFor="email">Email</label>
      <input type="email" placeholder="Email" />
      <label htmlFor="name">Name</label>
      <input type="text" placeholder="Name" />
      <label htmlFor="password">Password</label>
      <input type="password" placeholder="Password" />
      <label htmlFor="age">Age</label>
      <input type="number" placeholder="Age" />
      <label htmlFor="height">Height</label>
      <input type="number" placeholder="Height" />
      <button type="submit">{buttonText}</button>
    </form>
  );
}
