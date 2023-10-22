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
                this.info("Receieved message for device id " + this.id);
                blauBergResource.findById(this.id).then(device => {
                    if(device == null) {
                        this.info("Device not found");
                        return;
                    }
                
                    var receivedDevice = msg.payload as Device;
                    device.speed = receivedDevice.speed ?? device.speed;
                    device.mode = receivedDevice.mode ?? device.mode;
                    device.manualSpeed = receivedDevice.manualSpeed ?? device.manualSpeed;
                    device.on = receivedDevice.on ?? device.on;
                    
                    this.info("Sending message to device: " + device);
                    blauBergResource.save(device);
                });
                
            }
        });

        this.on('editprepare', async _ => {
            this.info("Listing devices.");
            var devices = (await blauBergResource.findAll()).content;
            var el = document.getElementById('node-input-id') as any;
            el.typedInput({
                types: [
                    {
                        value: "id",
                        options: devices.map(d => {return {value: d.id, label: d.id};})
                    }
                ]
            })
        });
    }

    RED.nodes.registerType("blauberg-vento", blaubergNode);
}
