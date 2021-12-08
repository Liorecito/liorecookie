//BOT con distintas opciones para jugar Cookie Clicker de manera más eficiente

var lioreBOT;
if (!lioreBOT) lioreBOT = {};
lioreBOT.version = "2.042";
lioreBOT.gameVersion = "2.042";

// Aquí empieza el bot
lioreBOT.botName = "Liorecito";
lioreBOT.deadline = 0;

lioreBOT.run = function() 
{
  lioreBOT.now=Date.now();
  lioreBOT.cpsMult = Game.cookiesPs/Game.unbuffedCps;

  if (Game.bakeryNameL.textContent.slice(0,lioreBOT.botName.length) != lioreBOT.botName) 
  {
    Game.bakeryNameL.textContent = "El mundo galletas de " + lioreBOT.botName;
  } //Sobreescribe el nombre de la confitería por el nombre del bot

  lioreBOT.deadline = lioreBOT.now + 60000; //Un minuto antes de ejecutar el siguiente paso
  lioreBOT.setDeadline(lioreBOT.now + (lioreBOT.now-Game.startDate) / 10);

  //Ejecución de funciones
  lioreBOT.manejoClics();
  lioreBOT.galletasDoradas();
  lioreBOT.logrosFaciles();

}


//===================== Galletas doradas ==========================
lioreBOT.galletasDoradas = function()
{
  if (lioreBOT.Config.GoldenClickMode==0) return;

  if (Game.TickerEffect) Game.tickerL.click(); //Recoger galleta de la fortuna

  var s = Game.shimmers[sx];

  if (lioreBOT.Config.GoldenClickMode==1) 
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
lioreBOT.manejoClics = function ()
{
  if (lioreBOT.Config.ClickMode==0) return;

  if (lioreBOT.Config.ClickMode>1) 
  {
    for (var i = 1; i<10; i++) setTimeout(lioreBOT.speedClicking, 30*i);
  } 
  else //ModoClic == 1
  {
    Game.ClickCookie();
  }

}

lioreBOT.speedClicking = function() {
  Game.ClickCookie();
  var clickCount = 1 << (10 * (lioreBOT.Config.ClickMode-2));
  Game.ClickCookie(0, clickCount * Game.computedMouseCps);
}

//===================== Pequeños logros ==========================
lioreBOT.logrosFaciles = function() 
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
    lioreBOT.info("Se encontró la magdalena olvidada al fondo del menú de \"Info\"");
    Game.Win("Olden days"); //Otorga logro de clickear la magdalena del menú info
  }

}


//===================== Menu ==========================
if(!lioreBOT.Backup) lioreBOT.Backup = {};
lioreBOT.Config = {};
lioreBOT.ConfigData = {};
lioreBOT.Disp = {};

lioreBOT.ConfigPrefix = 'lioreBOTConfig';

lioreBOT.SaveConfig = function(config) {
  try {
    window.localStorage.setItem(lioreBOT.ConfigPrefix, JSON.stringify(config));
  } catch (e) {}
}

lioreBOT.LoadConfig = function() {
  try {
    if (window.localStorage.getItem(lioreBOT.ConfigPrefix) != null) {
      lioreBOT.Config = JSON.parse(window.localStorage.getItem(lioreBOT.ConfigPrefix));
     // Comprobar valores
      var mod = false;
      for (var i in lioreBOT.ConfigDefault) {
        if (typeof lioreBOT.Config[i]==='undefined' || lioreBOT.Config[i]<0 ||
            lioreBOT.Config[i]>=lioreBOT.ConfigData[i].label.length) {
          mod = true;
          lioreBOT.Config[i] = lioreBOT.ConfigDefault[i];
        }
      }
      if (mod) lioreBOT.SaveConfig(lioreBOT.Config);
    } else { // Valores por defecto
      lioreBOT.RestoreDefault();
    }
  } catch (e) {}
}

lioreBOT.RestoreDefault = function() {
  lioreBOT.Config = {};
  lioreBOT.SaveConfig(lioreBOT.ConfigDefault);
  lioreBOT.LoadConfig();
  Game.UpdateMenu();
}

lioreBOT.ToggleConfig = function(config) {
  lioreBOT.ToggleConfigUp(config);
  l(lioreBOT.ConfigPrefix + config).className =
    lioreBOT.Config[config]?'option':'option off';
}

lioreBOT.ToggleConfigUp = function(config) {
  lioreBOT.Config[config]++;
  if (lioreBOT.Config[config]==lioreBOT.ConfigData[config].label.length)
    lioreBOT.Config[config] = 0;
  l(lioreBOT.ConfigPrefix + config).innerHTML = lioreBOT.Disp.GetConfigDisplay(config);
  lioreBOT.SaveConfig(lioreBOT.Config);
}

lioreBOT.ConfigData.ClickMode =
  {label: ['Desactivado', 'Normal', 'Rápidos'], desc: 'Velocidad de Clics'};
lioreBOT.ConfigData.GoldenClickMode =
  {label: ['Recoger algunas', 'Recoger todas'], desc: 'Recoger galletas doradas'};

lioreBOT.ConfigDefault = {ClickMode: 1, GoldenClickMode: 1};

lioreBOT.LoadConfig();

lioreBOT.Disp.GetConfigDisplay = function(config) {
  return lioreBOT.ConfigData[config].label[lioreBOT.Config[config]];
}

lioreBOT.Disp.AddMenuPref = function() {
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
  div.className = 'title ' + lioreBOT.Disp.colorTextPre + lioreBOT.Disp.colorBlue;
  div.textContent = 'Configuración de Liorecito';
  frag.appendChild(div);
  var listing = function(config,clickFunc) {
    var div = document.createElement('div');
    div.className = 'listing';
    var a = document.createElement('a');
    a.className = 'option';
    if (lioreBOT.Config[config] == 0) a.className = 'option off';
    a.id = lioreBOT.ConfigPrefix + config;
    a.onclick = function() { lioreBOT.ToggleConfig(config); };
    if (clickFunc) a.onclick = clickFunc;
    a.textContent = lioreBOT.Disp.GetConfigDisplay(config);
    div.appendChild(a);
    var label = document.createElement('label');
    label.textContent = lioreBOT.ConfigData[config].desc;
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

if (!lioreBOT.Backup.UpdateMenu) lioreBOT.Backup.UpdateMenu = Game.UpdateMenu;

Game.UpdateMenu = function() {
  lioreBOT.Backup.UpdateMenu();
  if (Game.onMenu == 'prefs') lioreBOT.Disp.AddMenuPref();
}