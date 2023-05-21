import Window from "node-hide-console-window";
import RPC, { Presence } from "discord-rpc";
import child from "child_process";
import Tray from "systray";
import HTTP from "http";
import FS from "fs";

class Main {
     readonly rpc = new RPC.Client({ transport: "ipc" });
     readonly icons = {
          default: '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+P/39/f/8PDz////+v/ExMT/m5uf/+Tk5P/f39//6Ojo/+7u7v/d3d3/kZGRTKampgD///8Az8/PxPr6+v/39/f8+Pj3//Pz9P//////zc3T/xERdf8BAaz/CgnG/wEAp/8CAV3/ZmV2/+np6P//////9vb4//f39//5+fn/9vb4//X19f////3/t7fT/w4OIP8lJSb/5eXm/+jo6P/i4uL/6urq/erq6v/KysrS////AAAAAAbe3t7Z+vr6//b29v3z8/X////9/9LS7/8XF17/AAAQ/wYGOv8AAHH/IyK0/6+vx/////7/+/v8//X19f/4+Pj/+Pj4//f39//7+/n////9/4SD2P8CAnj/AAAi/xYWXv/MzNH/5+fm/+rq6v/o6Oj96urq/9DQ0NMAAAABAAAAA+Hh4df5+fn/8/Pz/f/////c3Nb/Ghtn/wAAgf8AACD/FRUj/3h4h//k5Nr///////b29v/29vb/+Pj4//j4+P/29vf//f37/+rq8v9PT9H/AACz/wYGp/8GBpD/AQJH/6Sko//c3N3/5ubm/+Tk5P3a2tr/wMDA1AAAAAD///8A5OTky/f39//8/Pj91dTr/yEgi/8AAHD/AAB7/yQkVf+6ubb///////r6+//19fb/+Pj4//j4+P/4+Pj/9/f3//z8+v/m5uv/MTCr/wAAvP8CArr/AADG/wEBff8AACb/mpmx/+Xl4P/MzM3/w8PD/dra2v/V1dXUAAAAAP39/QDh4eGi9fX2//7++/uiorn/KSmT/xERlf9WVm7/5eXj///////09PX/9/f3//j4+P/4+Pj/+Pj4//j4+P/4+Pj/+fn5//Dw8f/Q0Nn/ra3R/2ppuP89PaT/KSlK/5GRo//Pz8//0NDQ/9HR0f/U1NT97u7u/9vb29MAAAAA4uLiAMvLy4fy8vL/9vb2+/39+//z8+n/3t/c//n5+P/7+/z/9PT0//j4+P/4+Pj/+Pj4//f39//4+Pj/+Pj4//j4+P/39/f/+fn5/////f////v////3//X16f/q6ub/7Ozp/8bGxv/U1NT/7u7u/+/v7/309PT/3Nzc1AAAAADg4OAAwcHBjO/v7//09PT79PT1//f3+f/8/Pz/9vb3//b29v/39/f+9/f3/vf39/739/f/9/f3//f39//4+Pj/+Pj4//f39//39/f/9fX2/fT09v7y8vX/8vL1//Hx8v/l5eX/0tLS/+jo6P/w8PD/8fHx/PT09P/j4+PB////AP///wDBwcGk8vLy//Dw8Pfz8/P79PT0+/Pz9Pv19fX79vb2+/f39//39/f/9/f3//f39/z39/f+9/f3/vf39/739/f+9/f3/ff39/v39/f/9vb2/vT09P7y8vL98PDw/e7u7v3h4eH86+vr/fLy8vvy8vL49fX1/9DQ0ML///8A////ANjY2MXy8vL/8fHx/PHx8f/x8fH/8vLy//Pz8//09PT/9/f3+Pf39/P29vb09vb2//b29v/29vb/9vb2//b29v/39/f/9vb2/ff399r09PTv8vLy//Pz8/7y8vL/8PDw/+bm5v/f39/+6enp/+7u7vz09PT/6Ojow////wDz8/MA8/PzUfPz843z8/OL9PT0lvT09Jv09PSb9PT0ovb29oL6+vob+vr6F/r6+hP39/eB9vb27ff39+n29vbp9vb27PPz8+Dz8/N55OTkAObm5mfy8vL69PT01/T09NTy8vLG7+/vwtzc3Hrf39967+/vgfPz83D19fUe9vb2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9/f0A////AP///wH8/PwQ+/v7E/v7+xL9/f0T7e3tD////wDi4uIA7OzsB/r6+hT+/v4G+vr6AP39/QD///8A////AAAAAACXl5cAl5eXAJeXlwCXl5cAgBkvskQAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAABgAAAAQAAAAEAAAABAAAAAYAAAAGAAAABgAAAAYAAAAKAAAABgAAAAQAAAAAAAAAAgAAAAIAAAACAAAAAgAAAAYAAAAGAAAABgAAQAf/QMVQ='
     };
     tray: Tray;
     server: HTTP.Server;
     config = {
          host: "127.0.0.1",
          port: 4444,
          clientId: "957274279173554226",
          debug: false
     };
     // status variables
     idleTime = 0;
     state = true;
     status = false;
     gameStatus = false;
     steamName: string | undefined;
     data: Presence = { state: "Main Lobby", largeImageKey: "logo", startTimestamp: Date.now() };

     constructor() {
          this.tray = new Tray({
               debug: false,
               copyDir: true,
               menu: {
                    icon: this.icons.default,
                    title: `Dota 2 RPC`,
                    tooltip: `Dota 2 RPC`,
                    items: this.getTray()
               }
          })
               .onReady(() => this.init()).onClick(action => {
                    if (!action.seq_id) {
                         this.state = !action.item.checked;
                         if (!this.state) return this.rpc.clearActivity().catch(() => null);
                    };
                    if (action.seq_id === 2) this.kill(); // Exit
               });
     }

     private async init() {
          let args: string[] = process.argv.slice(2);
          let path = args.find(arg => arg.startsWith("configFile=") ? arg.replace("configFile=", '') : false) || process.env.USERPROFILE + "/dota2-rpc.json";
          await this.getConfig(path);
          // if (!this.config.debug) Window.hideConsole();
          this.server = HTTP.createServer((req, res) => {
               if (req.method != "POST") return;
               let data = '';
               req.on("data", d => data += d).on("end", () => (this.updateState(JSON.parse(data)), res.end()));
          }).listen(this.config.port, this.config.host);
          this.rpc.on("ready", () => (console.log("RPC Ready"), this.status = true)).on("connected", () => (console.log("RPC Connected"), this.status = true));
          let _ = 0;
          return setInterval(async () => {
               if (this.state && !this.status) await this.rpc.login({ clientId: this.config.clientId }).catch(console.error);
               if ((await this.isGameRunning())) {
                    if (!_) {
                         if (!this.data.startTimestamp) this.data.startTimestamp = Date.now();
                         this.gameStatus = true;
                         this.updateState(undefined, true);
                         _ = 1;
                    };
               }
               else {
                    _ = 0;
                    this.data.startTimestamp = undefined;
                    this.gameStatus = false;
                    await this.rpc.clearActivity().catch(console.error);
               };
               this.getTray().forEach((item, seq) => this.tray.sendAction({ type: "update-item", seq_id: seq, item }));
          }, 400);
     }

     async getConfig(path: string) {
          let config: typeof this.config = FS.existsSync(path)
               ? JSON.parse(FS.readFileSync(path, "utf-8"))
               : undefined;
          if (!config) {
               console.clear();
               console.log("Configuration not found. Entering setup...\n");
               await this.delay(3000);
               console.log("Dota 2 GameStateIntegration Setup");
               FS.writeFileSync(path, JSON.stringify({
                    ...this.config,
                    clientId: null
               }), "utf-8");
               console.log(`Creating configuration at ${path}`);
               console.log("Restarting in 5 seconds...");
               await this.delay(5000);
               console.clear();
          };
          this.config = {
               ...config,
               clientId: config.clientId || this.config.clientId
          };
     }

     kill() {
          this.tray.kill();
          process.exit(0);
     }

     updateState(data: any, init = false) {
          if (!this.status || !this.state) return;
          this.steamName = data?.player?.name ?? this.steamName;
          if (!this.data.startTimestamp && data?.map?.game_time) this.data.startTimestamp = Date.now() - (data?.provider?.timestamp * 1000);
          switch (data?.map?.game_state) {
               default:
                    if (data?.player?.team2) {
                         this.data.state = undefined;
                         this.data.details = "Spectating";
                         this.data.smallImageKey = "spectating";
                    }
                    else if (init || (!Object.values(data.player).length && !Object.values(data.draft).length)) {
                         if (!this.idleTime) this.idleTime++;
                         if (this.idleTime > 100) this.data.state = "Idling";
                         this.data.largeImageText = this.steamName ?? data?.provider.name ?? "Dota 2";
                    }
                    break;

               case "DOTA_GAMERULES_STATE_HERO_SELECTION":
                    this.idleTime = 0;
                    this.data.details = "Hero Selection";
                    this.data.smallImageKey = "empty_hero";
                    this.data.largeImageKey = data.player.team_name;
                    this.data.largeImageText = this.fixName(data.player.team_name);
                    break;
               case "DOTA_GAMERULES_STATE_STRATEGY_TIME":
                    this.idleTime = 0;
                    this.data.details = "Pre-Match";
                    this.data.smallImageKey = this.fixNameKey(data.hero.name);
                    this.data.smallImageText = this.fixName(data.hero.name);
                    this.data.largeImageKey = data.player.team_name;
                    this.data.largeImageText = this.fixName(data.player.team_name);
                    break;
               case "DOTA_GAMERULES_STATE_PRE_GAME":
               case "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS":
               case "DOTA_GAMERULES_STATE_POST_GAME":
                    this.idleTime = 0;
                    this.data.details = `Level ${data.hero.level}`;
                    this.data.state = `${data.player.kills}/${data.player.deaths}/${data.player.assists}`;
                    this.data.smallImageKey = this.fixNameKey(data.hero.name);
                    this.data.smallImageText = this.fixName(data.hero.name);
                    this.data.largeImageKey = data.player.team_name;
                    this.data.largeImageText = `Team ${this.fixName(data.player.team_name)}`;
                    break;
          };
          this.rpc.setActivity(this.data).catch(console.error);
     }

     fixNameKey(str: string) {
          return str.replace("npc_dota_hero_", '');
     }

     fixName(str: string) {
          str = this.fixNameKey(str);
          if (str === "queenofpain") return "Queen of Pain";
          if (str === "keeper_of_the_light") return "Keeper of the Light";
          if (str.includes('_')) return str.split('_').map(s => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase()).join(' ');
          return str.split(' ').map(s => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase()).join(' ');
     }

     getTray() {
          return [
               {
                    // 0
                    title: this.status && this.rpc.user
                         ? `Connected to ${this.rpc.user.username}#${this.rpc.user.discriminator}`
                         : this.state ? "Connecting to discord..." : "Not connected to discord",
                    tooltip: "user",
                    checked: this.state,
                    enabled: true
               },
               {
                    // 1
                    title: this.gameStatus ? "Game Connected" : "Game not running",
                    tooltip: "dotaStatus",
                    checked: false,
                    enabled: false
               },
               {
                    // 2
                    title: "Exit",
                    tooltip: "exit",
                    checked: false,
                    enabled: true
               }
          ]
     }

     async isGameRunning() {
          return await new Promise<boolean>(
               ($) => child.exec("tasklist", (_, res) => $(!!_ || res.includes("dota2.exe")))
          );
     }

     async delay(time: number) {
          await new Promise((send) => setTimeout(() => send(undefined), time));
     }
}
new Main();