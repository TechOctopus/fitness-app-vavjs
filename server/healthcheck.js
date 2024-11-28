fetch("http://localhost:3333/health").then((res) => {
  if (res.status === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});
