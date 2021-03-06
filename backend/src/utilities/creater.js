const getTimestampSec = (timestamp) => {
  return timestamp.valueOf() / 1000 | 0;
}

const createRandom = () => {
  let random = 0;
  while(random === 0) {
    random = Math.floor(Math.random() * 0x1000);
  }
  return random.toString(16).toUpperCase().padStart(3, '0');
}


const makeAIDu = (timestamp, random) => {
  const timestampSec = getTimestampSec(timestamp);
  return `M.${timestampSec}.A.${random}`;
};

let hot_brdname_list = [
  "Gossiping",
  "Stock",
  "C_Chat",
  "NBA",
  "Baseball",
];

const getHotBrdnameList = () => {
  return hot_brdname_list;
}

export {
  createRandom,
  makeAIDu,
  getHotBrdnameList,
};