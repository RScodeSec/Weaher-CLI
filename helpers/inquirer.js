const inquirer = require("inquirer");
require("colors");

const questions = [
  {
    type: "list",
    name: "option",
    message: "what do you want to do",
    choices: [
      {
        value: 1,
        name: `${"1.".red}Sarch city`,
      },
      {
        value: 2,
        name: `${"2.".red}History`,
      },

      {
        value: 0,
        name: `${"0.".red}Exit\n`,
      },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();

  console.log("=================================".green);
  console.log("  Choose the option to continue".green);
  console.log("=================================\n".green);

  const { option } = await inquirer.prompt(questions);
  return option;
};

const pause = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Press ${"enter".red} to continue`,
    },
  ];
  console.log("\n");
  await inquirer.prompt(question);
};

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length == 0) {
          return "Please enter a value";
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listPlaces = async (places = []) => {
  const choices = places.map((place, index) => {
    const idx = `${index + 1}.`.green;
    return {
      value: place.id,
      name: `${idx} ${place.name}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0".green + " Cancelar ",
  });

  const question = [
    {
      type: "list",
      name: "id",
      message: "Select a place",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(question);
  return id;
};

const confirm = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];
  const { ok } = await inquirer.prompt(question);
  return ok;
};

const showListedCheckList = async (tasks = []) => {
  const choices = tasks.map((task, index) => {
    const idx = `${index + 1}.`.green;
    return {
      value: task.id,
      name: `${idx} ${task.desc}`,
      checked: task.completedIn ? true : false,
    };
  });

  const question = [
    {
      type: "checkbox",
      name: "ids",
      message: "Select",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(question);
  return ids;
};

module.exports = {
  inquirerMenu,
  pause,
  readInput,
  listPlaces,
  confirm,
  showListedCheckList,
};
