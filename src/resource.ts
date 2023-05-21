import fetch from "node-fetch";
import fs from "fs";

const namesDir = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota\\itembuilds";
const baseApi = "https://cdn.dota2.com/apps/dota2/images/heroes";
const outDIr = `C:\\Files\\Projects\\dota2-gsi\\assets\\icons\\heroes\\api`;

async function main() {
     const names = fs.readdirSync(namesDir).map(name => name.replace("default_", '').replace(".txt", ''));
     const notSaved = new Array<string>();
     for (let name of names) {
          const avatarJpg = await fetch(`${baseApi}/${name}_vert.jpg`).then(res => res.status === 404 ? null : res).catch(() => null);
          const avatar = avatarJpg ?? await fetch(`${baseApi}/${name}_vert.png`).then(res => res.status === 404 ? null : res).catch(() => null);
          if (avatar?.status === 200) await avatar.body.pipe(fs.createWriteStream(`${outDIr}/${name}.png`));
          else notSaved.push(name);
     }
     console.log(notSaved);
}

main();