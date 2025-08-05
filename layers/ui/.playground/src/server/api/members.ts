const members = [
  {
    name: "Clayton Chew",
    username: "claytonchew",
    role: "owner",
    avatar: { src: "https://github.com/claytonchew.png" },
  },
  {
    name: "Ronnie Chew",
    username: "ronnie-chew",
    role: "member",
    avatar: { src: "https://github.com/ronnie-chew.png" },
  },
  {
    name: "Yeoh Lee Ming",
    username: "leeming988QM",
    role: "member",
    avatar: { src: "https://github.com/leeming988QM.png" },
  },
  {
    name: "Ong Ming Yen",
    username: "ongmingyen",
    role: "member",
    avatar: {
      src: "https://github.com/ongmingyen.png",
    },
  },
  {
    name: "Steven Lim",
    username: "steven-QM",
    role: "member",
    avatar: {
      src: "https://github.com/steven-QM.png",
    },
  },
  {
    name: "Ang Chee Keat",
    username: "CheeKeat-QM",
    role: "member",
    avatar: {
      src: "https://github.com/CheeKeat-QM.png",
    },
  },
  {
    name: "Reynold Chong",
    username: "reynoldcky",
    role: "member",
    avatar: { src: "https://github.com/reynoldcky.png" },
  },
  {
    name: "Zulfidly Zulkifli",
    username: "fidlyqm",
    role: "member",
    avatar: { src: "https://github.com/fidlyqm.png" },
  },
];

export default eventHandler(async () => {
  return members;
});
