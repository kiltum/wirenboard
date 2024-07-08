function send_alert(message) {
    var token = "TOKEN";
    var chat_id = CHAIT_ID;
    var command = 'curl -s -X POST https://api.telegram.org/bot{}/sendMessage -d chat_id={} -d text="{}"'.format(token, chat_id, message);
  
    runShellCommand(command);
  }
  
  trackMqtt("/devices/+/controls/battery", function(message) {
    var ps = new PersistentStorage("battery_values", {global: true});
    // Uncomment next line and save once when persistent storage lost its values again
    //ps["/devices/sleeping_room_window/controls/battery"] = 100;
    //log.debug("{} {}".format(message.topic,ps[message.topic]))
    var previos_battery = 0;
    var new_battery = parseInt(message.value);
    
    if( !isNaN(ps[message.topic]) ) {
      previos_battery = parseInt(ps[message.topic]);
    } else {
      ps[message.topic] = 100; // reset battery status to 100%
      log.info("Persistent storage for " + message.topic + " crushed again");
    }
    
    if ( previos_battery != new_battery ) {
      ps[message.topic] = new_battery;
      //if ( new_battery < 70 ) {
        log.info("Battery on {} is {}".format(message.topic, new_battery))
        send_alert("Battery on {} is {}".format(message.topic, new_battery))  
      //}
    }
  });
  