const valorant = async () => {
  const res = await fetch(`https://valorant-api.com/v1/playercards`);
  const data = await await res.json();
  console.log(data);
};

valorant();
