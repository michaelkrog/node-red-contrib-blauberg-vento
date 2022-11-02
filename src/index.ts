import { BlaubergVentoResource, Device } from 'blaubergventojs';
import { Red, Node } from 'node-red';


module.exports = function (RED: Red) {
    var blauBergResource = new BlaubergVentoResource();

    function blaubergNode(config: any) {
        RED.nodes.createNode(this, config);

        var node = this;
        this.on('input', (msg) => {
            this.id = config.id;
            if(this.id != null) {    
                this.debug("Receieved message for device id " + this.id);
                blauBergResource.findById(this.id).then(device => {
                    if(device == null) {
                        this.debug("Device not found");
                        return;
                    }
                
                    var receivedDevice = msg.payload as Device;
                    device.speed = receivedDevice.speed ?? device.speed;
                    device.mode = receivedDevice.mode ?? device.mode;
                    device.manualSpeed = receivedDevice.manualSpeed ?? device.manualSpeed;
                    device.on = receivedDevice.on ?? device.on;
                    
                    this.debug("Sending message to device: " + device);
                    blauBergResource.save(device);
                });
                
            }
        });
    }

    RED.nodes.registerType("blauberg-vento", blaubergNode);
}
