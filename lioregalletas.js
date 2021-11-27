var AutoPlay;
if (!AutoPlay) AutoPlay = {};
AutoPlay.version = "2.042";
AutoPlay.gameVersion = "2.042";

AutoPlay.robotName = "Liorecito ";

//===================== Nombre confiteria ==========================
AutoPlay.run = function() { 
  if (Game.bakeryNameL.textContent.slice(0,AutoPlay.robotName.length)!=AutoPlay.robotName) {
    Game.bakeryNameL.textContent = AutoPlay.robotName;
  }
}


//===================== Galletas Doradas ==========================
AutoPlay.handleGoldenCookies = function() {
  if (AutoPlay.Config.GoldenClickMode==0) return;
  if (Game.TickerEffect) Game.tickerL.click();
}


//===================== Clics ==========================
AutoPlay.speedClicking = function() {
  Game.ClickCookie();
  var clickCount = 1<<(10*(AutoPlay.Config.ClickMode-2));
  Game.ClickCookie(0, clickCount*Game.computedMouseCps);
}


//===================== Menu ==========================
if(!AutoPlay.Backup) AutoPlay.Backup = {};
AutoPlay.Config = {};
AutoPlay.ConfigData = {};
AutoPlay.Disp = {};

AutoPlay.ConfigPrefix = 'autoplayConfig';

AutoPlay.SaveConfig = function(config) {
  try {
    window.localStorage.setItem(AutoPlay.ConfigPrefix, JSON.stringify(config));
  } catch (e) {}
}

AutoPlay.LoadConfig = function() {
  try {
    if (window.localStorage.getItem(AutoPlay.ConfigPrefix) != null) {
      AutoPlay.Config = JSON.parse(window.localStorage.getItem(AutoPlay.ConfigPrefix));
     // Check values
      var mod = false;
      for (var i in AutoPlay.ConfigDefault) {
        if (typeof AutoPlay.Config[i]==='undefined' || AutoPlay.Config[i]<0 ||
            AutoPlay.Config[i]>=AutoPlay.ConfigData[i].label.length) {
          mod = true;
          AutoPlay.Config[i] = AutoPlay.ConfigDefault[i];
        }
      }
      if (mod) AutoPlay.SaveConfig(AutoPlay.Config);
    } else { // Default values
      AutoPlay.RestoreDefault();
    }
  } catch (e) {}
}

AutoPlay.RestoreDefault = function() {
  AutoPlay.Config = {};
  AutoPlay.SaveConfig(AutoPlay.ConfigDefault);
  AutoPlay.LoadConfig();
  Game.UpdateMenu();
}

AutoPlay.ToggleConfig = function(config) {
  AutoPlay.ToggleConfigUp(config);
  l(AutoPlay.ConfigPrefix + config).className =
    AutoPlay.Config[config]?'option':'option off';
}

AutoPlay.ToggleConfigUp = function(config) {
  AutoPlay.Config[config]++;
  if (AutoPlay.Config[config]==AutoPlay.ConfigData[config].label.length)
    AutoPlay.Config[config] = 0;
  l(AutoPlay.ConfigPrefix + config).innerHTML = AutoPlay.Disp.GetConfigDisplay(config);
  AutoPlay.SaveConfig(AutoPlay.Config);
}

AutoPlay.ConfigData.BotMode =
  {label: ['Desactivado', 'Automático', 'Manual'], desc: 'Liore galletas opcion general (trabajanding en esta opcion)'};
AutoPlay.ConfigData.ClickMode =
  {label: ['Desactivada', 'Normal', 'Moderada', 'Rapida', 'Muy rapida'],
   desc: 'Velocidad de clics'};
AutoPlay.ConfigData.GoldenClickMode =
  {label: ['Desactivado', 'Activado'], desc: 'Recoger galletas doradas'};

AutoPlay.ConfigDefault = {BotMode: 1, ClickMode: 1, GoldenClickMode: 1};

AutoPlay.LoadConfig();

AutoPlay.Disp.GetConfigDisplay = function(config) {
  return AutoPlay.ConfigData[config].label[AutoPlay.Config[config]];
}

AutoPlay.Disp.AddMenuPref = function() {
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
  div.className = 'title ' + AutoPlay.Disp.colorTextPre + AutoPlay.Disp.colorBlue;
  div.textContent = 'Cookiebot Options';
  frag.appendChild(div);
  var listing = function(config,clickFunc) {
    var div = document.createElement('div');
    div.className = 'listing';
    var a = document.createElement('a');
    a.className = 'option';
    if (AutoPlay.Config[config] == 0) a.className = 'option off';
    a.id = AutoPlay.ConfigPrefix + config;
    a.onclick = function() { AutoPlay.ToggleConfig(config); };
    if (clickFunc) a.onclick = clickFunc;
    a.textContent = AutoPlay.Disp.GetConfigDisplay(config);
    div.appendChild(a);
    var label = document.createElement('label');
    label.textContent = AutoPlay.ConfigData[config].desc;
    div.appendChild(label);
    return div;
  }
  frag.appendChild(header('Configuracion BOT'));
  frag.appendChild(listing('BotMode',AutoPlay.setBotMode));
  frag.appendChild(listing('ClickMode',null));
  frag.appendChild(listing('GoldenClickMode',null));
  
  l('menu').childNodes[2].insertBefore(frag, l('menu').childNodes[2].
      childNodes[l('menu').childNodes[2].childNodes.length - 1]);
}

if (!AutoPlay.Backup.UpdateMenu) AutoPlay.Backup.UpdateMenu = Game.UpdateMenu;

AutoPlay.setBotMode = function() {
  AutoPlay.ToggleConfig('BotMode');
  AutoPlay.info("The bot has changed mode to "+AutoPlay.ConfigData.BotMode.label[AutoPlay.Config.BotMode]);
//  AutoPlay.info("The bot has changed mode to "+AutoPlay.ConfigData.BotMode[]);
}

Game.UpdateMenu = function() {
  AutoPlay.Backup.UpdateMenu();
  if (Game.onMenu == 'prefs') AutoPlay.Disp.AddMenuPref();
}

//===================== Auxiliary ==========================

AutoPlay.info = function(s) {
  console.log("### "+s);
  Game.Notify("CookieBot",s,1,100);
}

AutoPlay.status = function(print=true) { // just for testing purposes
  var ach=0;
  var sach=0;
  var up=0;
  var lum=0;
  let nonUp=[71,72,73,87,227];
  for (var a in Game.Achievements) {
    var me = Game.Achievements[a];
    if (!me.won && me.pool!="dungeon") { // missing achievement
      if (print) AutoPlay.info("Missing achievement #" + me.id +
        ": " + me.desc.replace(/<q>.*?<\/q>/ig, ''));
      if (me.pool=="shadow") sach++;
      ach++;
    }
  }
  for (var i in Game.Upgrades) {
    var me = Game.Upgrades[i];
    if (!me.bought && me.pool!="debug" && me.pool!="toggle") {
      if (Game.resets && nonUp.includes(me.id)) continue;
      if (print) AutoPlay.info("Upgrade " + me.name + " is missing.");
      up++;
    }
  }
  for (var o in Game.Objects) {
    var me = Game.Objects[o];
    var maxl = 10;
    var myl = 0;
    if (me.id==0) maxl=12; // cursors need level 12
    for (var l=me.level+1; l<=maxl; l++) myl+=l;
    if (print && myl) AutoPlay.info(""+myl+" sugar lumps missing for " + me.name + ".");
	lum+=myl;
  }
  lum-=Game.lumps;
  if (lum<0) lum=0;
  AutoPlay.addActivity("Missing "+(ach)+" achievements ("+sach+" shadow), "+up+" upgrades, and "+lum+" sugar lumps.");
}

AutoPlay.setDeadline = function(d) {
  if (AutoPlay.deadline>d) AutoPlay.deadline=d;
}

AutoPlay.logging = function() {
  if(!AutoPlay.loggingInfo) return;
  try {
    var before = window.localStorage.getItem("autoplayLog");
    var toAdd = "#logging autoplay V" + AutoPlay.version + " with " +
                AutoPlay.loggingInfo + "\n" + Game.WriteSave(1) + "\n";
    AutoPlay.loggingInfo = 0;
    window.localStorage.setItem("autoplayLog",before+toAdd);
  } catch (e) {}
}

AutoPlay.cleanLog = function() {
  try {
    window.localStorage.setItem("autoplayLog","");
  } catch (e) {}
}

AutoPlay.showLog = function() {
  var theLog="";
  try {
    theLog=window.localStorage.getItem("autoplayLog");
  } catch (e) { theLog=""; }
  var str=
    Game.Prompt('<h3>Cookie Bot Log</h3><div class="block">'+
      'This is the log of the bot with saves at important stages.<br>'+
      'Copy it and use it as you like.</div>'+
      '<div class="block"><textarea id="textareaPrompt" '+
      'style="width:100%;height:128px;" readonly>'+
      theLog+'</textarea></div>',
      ['All done!']);
}

AutoPlay.handleNotes = function() {
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

AutoPlay.whatTheBotIsDoing = function() {
  return '<div style="padding:8px;width:400px;font-size:11px;text-align:center;">'+
    '<span style="color:#6f6;font-size:18px"> What is the bot doing?</span>'+
    '<div class="line"></div>'+
    AutoPlay.activities+
    '</div>';
}

AutoPlay.addActivity = function(str) {
  if (!AutoPlay.activities.includes(str)) {
    AutoPlay.activities+= '<div class="line"></div>'+str;
    return true;
  } else return false;
}

//===================== Init & Start ==========================

if (AutoPlay.autoPlayer) {
  AutoPlay.info("Reemplazando version...");
  clearInterval(AutoPlay.autoPlayer);
}
AutoPlay.autoPlayer = setInterval(AutoPlay.run, 300); // 100 is too quick
l('versionNumber').innerHTML=
  'v. '+Game.version;
if (Game.version!=AutoPlay.gameVersion)
  AutoPlay.info("Este bot fue testeado en la version de  "+
    "cookie clicker " + AutoPlay.gameVersion);
