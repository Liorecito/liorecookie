//BOT con distintas opciones para jugar Cookie Clicker de manera más eficiente

var LioreBOT;
if (!LioreBOT) LioreBOT = {};
LioreBOT.version = "2.042";
LioreBOT.gameVersion = "2.042";

// Aquí empieza el bot
LioreBOT.botName = "Liorecito";
LioreBOT.deadline = 0;

LioreBOT.run = function() 
{
  LioreBOT.now=Date.now();

  if (Game.bakeryNameL.textContent.slice(0,LioreBOT.botName.length) != LioreBOT.botName) 
  {
    Game.bakeryNameL.textContent = "El mundo galletas de " + LioreBOT.botName;
  } //Sobreescribe el nombre de la confitería por el nombre del bot

  LioreBOT.deadline = LioreBOT.now + 60000; //Un minuto antes de ejecutar el siguiente paso
  LioreBOT.setDeadline(LioreBOT.now + (LioreBOT.now-Game.startDate) / 10);

  //Ejecución de funciones
  LioreBOT.manejoClics();
  LioreBOT.galletasDoradas();
  LioreBOT.logrosFaciles();
  LioreBOT.manejarNotas();

}


//===================== Galletas doradas ==========================
LioreBOT.galletasDoradas = function()
{
  if (LioreBOT.Config.GoldenClickMode==0) return;

  if (Game.TickerEffect) Game.tickerL.click(); //Recoger galleta de la fortuna

  var s = Game.shimmers[sx];

  if (LioreBOT.Config.GoldenClickMode==1) 
   { 
    s.pop();
   }

  if (s.type!="golden" || s.life<Game.fps) 
  {
    s.pop();
    return;
  }

  if ( (s.life/Game.fps) < (s.dur-2) ) 
  {
    s.pop();
    return;
  }

}

//===================== Clics y velocidad de clics ==========================
LioreBOT.manejoClics = function ()
{
  if (LioreBOT.Config.ClickMode==0) return;

  if (LioreBOT.Config.ClickMode>1) 
  {
    for (var i = 1; i<10; i++) setTimeout(LioreBOT.speedClicking, 30*i);
  } 
  else //ModoClic == 1
  {
    Game.ClickCookie();
  }

}

LioreBOT.speedClicking = function() {
  Game.ClickCookie();
  var clickCount = 1 << (10 * (LioreBOT.Config.ClickMode-2));
  Game.ClickCookie(0, clickCount * Game.computedMouseCps);
}

//===================== Pequeños logros ==========================
LioreBOT.logrosFaciles = function() 
{
  if (!Game.Achievements["Cheated cookies taste awful"].won) 
  {
    Game.Win("Cheated cookies taste awful");
  } //Otorga logro oculto

  if (!Game.Achievements["Third-party"].won)
  {
    Game.Win("Third-party"); //Otorga logro de herramienta de terceros
  }

  if (!Game.Achievements["Olden days"].won)
  {
    LioreBOT.info("Se encontró la magdalena olvidada al fondo del menú de \"Info\"");
    Game.Win("Olden days"); //Otorga logro de clickear la magdalena del menú info
  }

}


//===================== Menu ==========================
if(!LioreBOT.Backup) LioreBOT.Backup = {};
LioreBOT.Config = {};
LioreBOT.ConfigData = {};
LioreBOT.Disp = {};

LioreBOT.ConfigPrefix = 'autoplayConfig';

LioreBOT.SaveConfig = function(config) {
  try {
    window.localStorage.setItem(LioreBOT.ConfigPrefix, JSON.stringify(config));
  } catch (e) {}
}

LioreBOT.LoadConfig = function() {
  try {
    if (window.localStorage.getItem(LioreBOT.ConfigPrefix) != null) {
      LioreBOT.Config = JSON.parse(window.localStorage.getItem(LioreBOT.ConfigPrefix));
     // Comprobar valores
      var mod = false;
      for (var i in LioreBOT.ConfigDefault) {
        if (typeof LioreBOT.Config[i]==='undefined' || LioreBOT.Config[i]<0 ||
            LioreBOT.Config[i]>=LioreBOT.ConfigData[i].label.length) {
          mod = true;
          LioreBOT.Config[i] = LioreBOT.ConfigDefault[i];
        }
      }
      if (mod) LioreBOT.SaveConfig(LioreBOT.Config);
    } else { // Valores por defecto
      LioreBOT.RestoreDefault();
    }
  } catch (e) {}
}

LioreBOT.RestoreDefault = function() {
  LioreBOT.Config = {};
  LioreBOT.SaveConfig(LioreBOT.ConfigDefault);
  LioreBOT.LoadConfig();
  Game.UpdateMenu();
}

LioreBOT.ToggleConfig = function(config) {
  LioreBOT.ToggleConfigUp(config);
  l(LioreBOT.ConfigPrefix + config).className =
    LioreBOT.Config[config]?'option':'option off';
}

LioreBOT.ToggleConfigUp = function(config) {
  LioreBOT.Config[config]++;
  if (LioreBOT.Config[config]==LioreBOT.ConfigData[config].label.length)
    LioreBOT.Config[config] = 0;
  l(LioreBOT.ConfigPrefix + config).innerHTML = LioreBOT.Disp.GetConfigDisplay(config);
  LioreBOT.SaveConfig(LioreBOT.Config);
}

LioreBOT.ConfigData.ClickMode =
  {label: ['Desactivado', 'Normal', 'Rápidos'], desc: 'Velocidad de Clics'};
LioreBOT.ConfigData.GoldenClickMode =
  {label: ['Recoger algunas', 'Recoger todas'], desc: 'Recoger galletas doradas'};

LioreBOT.ConfigDefault = {ClickMode: 1, GoldenClickMode: 1};

LioreBOT.LoadConfig();

LioreBOT.Disp.GetConfigDisplay = function(config) {
  return LioreBOT.ConfigData[config].label[LioreBOT.Config[config]];
}

LioreBOT.Disp.AddMenuPref = function() {
  var header = function(text) {
    var div = document.createElement('div');
    div.className = 'listing';
    div.style.padding = '5px 16px';
    div.style.opacity = '0.7';
    div.style.fontSize = '17px';
    div.style.fontFamily = '\"Kavoon\", Georgia, serif';
    div.textContent = text;
    return div;
  }
  var frag = document.createDocumentFragment();
  var div = document.createElement('div');
  div.className = 'title ' + LioreBOT.Disp.colorTextPre + LioreBOT.Disp.colorBlue;
  div.textContent = 'Configuración de Liorecito';
  frag.appendChild(div);
  var listing = function(config,clickFunc) {
    var div = document.createElement('div');
    div.className = 'listing';
    var a = document.createElement('a');
    a.className = 'option';
    if (LioreBOT.Config[config] == 0) a.className = 'option off';
    a.id = LioreBOT.ConfigPrefix + config;
    a.onclick = function() { LioreBOT.ToggleConfig(config); };
    if (clickFunc) a.onclick = clickFunc;
    a.textContent = LioreBOT.Disp.GetConfigDisplay(config);
    div.appendChild(a);
    var label = document.createElement('label');
    label.textContent = LioreBOT.ConfigData[config].desc;
    div.appendChild(label);
    return div;
  }

  frag.appendChild(header(' '));
  frag.appendChild(header(' '));
  frag.appendChild(listing('ClickMode',null));
  frag.appendChild(listing('GoldenClickMode',null));

  l('menu').childNodes[2].insertBefore(frag, l('menu').childNodes[2].
      childNodes[l('menu').childNodes[2].childNodes.length - 1]);
}

if (!LioreBOT.Backup.UpdateMenu) LioreBOT.Backup.UpdateMenu = Game.UpdateMenu;

Game.UpdateMenu = function() {
  LioreBOT.Backup.UpdateMenu();
  if (Game.onMenu == 'prefs') LioreBOT.Disp.AddMenuPref();
}

//===================== Auxiliares ==========================

LioreBOT.info = function(s) {
  console.log("### "+s);
  Game.Notify("Liorecito BOT",s,1,100);
}

LioreBOT.setDeadline = function(d) {
  if (LioreBOT.deadline>d) LioreBOT.deadline=d;
}

LioreBOT.manejarNotas = function() {
  for (var i in Game.Notes)
    if (Game.Notes[i].quick==0) {
      Game.Notes[i].life=2000*Game.fps;
      Game.Notes[i].quick=1;
    }
}

function range(start, end) {
  var foo = [];
  for (var i = start; i<=end; i++) { foo.push(i); }
  return foo;
}

LioreBOT.addActivity = function(str) {
  if (!LioreBOT.activities.includes(str)) {
    LioreBOT.activities+= '<div class="line"></div>'+str;
    return true;
  } else return false;
}

//===================== Init & Start ==========================

if (LioreBOT.autoPlayer) {
  LioreBOT.info("Reemplazando versión");
  clearInterval(LioreBOT.autoPlayer);
}
LioreBOT.autoPlayer = setInterval(LioreBOT.run, 300); // 100 is too quick
l('versionNumber').innerHTML= 'v'+ Game.version;

if (Game.version != LioreBOT.gameVersion)
  LioreBOT.info("Liorecito ha sido testeado para la versión de cookie clicker " + LioreBOT.gameVersion);
