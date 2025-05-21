// Определяем все выключатели
defineVirtualDevice('svet', {
    title: 'Свет' ,
    cells: {
      spalnya: {
        title: "Спальня",
        type: "switch",
        value: false,
        order: 1,
      },
      zal_prohod: {
        title: "Зал проход",
        type: "switch",
        value: false,
        order: 2,
      },
      zal_center: {
        title: "Зал центр",
        type: "switch",
        value: false,
        order: 3,
      },
      zal_tele: {
        title: "Зал телевизор",
        type: "switch",
        value: false,
        order: 4,
      },
      zal_comp: {
        title: "Зал компьютер",
        type: "switch",
        value: false,
        order: 5
      },
      koridor: {
        title: "Коридор",
        type: "switch",
        value: false,
        order: 6
      }
    }
})

// Определяем уровень яркости
defineVirtualDevice('svet_value_night', {
    title: 'Яркость света в темноте' ,
    cells: {
      spalnya: {
        title: "Спальня",
        type: "range",
        value: 100,
        max: 100,
        min: 10,
        order: 1,
      },
      zal_prohod: {
        title: "Зал проход",
        type: "range",
        value: 100,
        max: 100,
        min: 10,
        order: 2,
      },
      zal_center: {
        title: "Зал центр",
        type: "range",
        value: 100,
        max: 100,
        min: 10,
        order: 3,
      },
      zal_tele: {
        title: "Зал телевизор",
        type: "range",
        value: 100,
        max: 100,
        min: 10,
        order: 4,
      },
      zal_comp: {
        title: "Зал компьютер",
        type: "range",
        value: 100,
        max: 100,
        min: 10,
        order: 5
      },
      koridor: {
        title: "Коридор",
        type: "range",
        value: 100,
        max: 100,
        min: 10,
        order: 6
      }
    }
})


// если light_control поменялся, то дерни relay_control 
function makeLight(name, light_control, relay_control) {
  defineRule(name, {
      whenChanged: light_control,
      then: function(newValue, devName, cellName) {
          dev[relay_control] = newValue;
        }
      }
)};

var stateTimer = [];

// Если если light_control поменялся, то если темно, то установи значение канала brightness_control в значение из brightness_name и дерни relay_control
// Иначе на полную яркость
function makeLightBrightness(name, light_control, relay_control, brightness_name, brightness_control) {
  defineRule(name, {
    whenChanged: light_control,
    then: function (newValue, devName, cellName) {
      if (newValue) { // Включение света
        if (stateTimer[devName] == true) { // Если таймер не завершился, значит повторное включение и нужна полная яркость
          dev[brightness_control] = 100;
        } else {
          if(dev["astrocalc/dark_outside"]) { 
            dev[brightness_control] = dev[brightness_name]; // на улице темно, не надо бить по глазам  
          } else {
            dev[brightness_control] = 100; // зачем-то днем понадобился свет
          }
        }
        dev[relay_control] = true;
      } else { // Выключение света
        dev[relay_control] = false;
        stateTimer[devName] = true;
        setTimeout(function () {
          stateTimer[devName] = false;
        }, 3000); // Ждем три секунды
      }

    }
  }
  )
};


// Спальня
makeLightBrightness("spalnya", "svet/spalnya", "wb-mdm3_188/K3", "svet_value_night/spalnya", "wb-mdm3_188/Channel 3");
makeLight("spalnya_switch", "wb-mdm3_188/Input 3", "svet/spalnya");

// Зал центр 4 лампочки, левый выключатель
makeLightBrightness("zal_center", "svet/zal_center", "wb-mdm3_183/K1", "svet_value_night/zal_center", "wb-mdm3_183/Channel 1");
makeLight("zal_center_switch", "wb-mdm3_183/Input 1", "svet/zal_center");

// Коридор
makeLightBrightness("koridor", "svet/koridor", "wb-mdm3_206/K2", "svet_value_night/koridor", "wb-mdm3_206/Channel 2");
makeLight("koridor_switch", "wb-mdm3_206/Input 5", "svet/koridor");


// Зал в проходе, правый выключатель

makeLight("zal_prohod", "svet/zal_prohod", "wb-mdm3_183/K2");
makeLight("zal_prohod_switch", "wb-mdm3_183/Input 2", "svet/zal_prohod");

// Лампы над телеком
makeLight("zal_tele", "svet/zal_tele", "wb-mdm3_183/K3");

// лампы над компьютером
makeLight("zal_comp", "svet/zal_comp", "wb-mdm3_188/K1");
