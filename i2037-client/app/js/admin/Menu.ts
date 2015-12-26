  export default class Menu {
    name: string;
    path: string;
    isActive: boolean = false;
    constructor(name, path) {
      this.name = name;
      this.path = path;
    }
  }

