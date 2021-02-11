import Dayjs from "dayjs";
import chalk from "chalk";

const timeFormat = "MM/DD HH:mm:ss";

const time = () => Dayjs().format(timeFormat);

const log = console.log;

const info = (str: string) => log(`${time()}:`, chalk.blue(str));

const error = (str: string) => log(`${time()}:`, chalk.red(str));

const warn = (str: string) => log(`${time()}:`, chalk.yellow(str));

const success = (str: string) => log(`${time()}:`, chalk.green(str));

export default {
  log,
  success,
  info,
  error,
  warn,
};
