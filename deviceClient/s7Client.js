"use strict";

const EventEmitter = require('events');
const snap7 = require('node-snap7');

const client = new snap7.S7Client();


class S7Client  extends EventEmitter {

    constructor(settings) {
        //console.log('>> S7Client: ctor');
        //console.log(settings);
        super();
        this.settings = settings;
    }

    connect() {
        const self = this;

        //console.log('>> s7Client.connect ' + this.settings.ipAddress + ' ' + this.settings.rack + ' ' + this.settings.slot);
        client.ConnectTo(this.settings.ipAddress, this.settings.rack, this.settings.slot, function(err) {
            if (err) {
                var error = 'Connection failed. Code #' + err + ' - ' + client.ErrorText(err);
                self.emit('error', error)
                return;
            }
            //console.log('>> s7Client: connected');
            self.emit('connected');
        });
    };

    readDI() {
        const self = this;
        let data = { di: []};

        //console.log('>> s7Client.readDI');
        client.EBRead(this.settings.diStart, this.settings.diSize, function(err, res) {
            if (err) {
                let error = 'EBRead failed. Code #' + err + ' - ' + client.ErrorText(err);
                self.emit('error', error)
                return;
            }

            for (let value of res.values()) {
                data.di.push(value);
            }
            //console.log(data);
            self.emit('di', data);
        });
    };

    readDO() {
        const self = this;
        let data = { do: []};

        //console.log('>> s7Client.readDO');
        client.ABRead(this.settings.doStart, this.settings.doSize, function(err, res) {
            if (err) {
                let error = 'ABRead failed. Code #' + err + ' - ' + client.ErrorText(err);
                self.emit('error', error)
                return;
            }

            for (let value of res.values()) {
                data.do.push(value);
            }
            //console.log(data);
            self.emit('do', data);
        });
    };

    readM() {
        const self = this;
        let data = { m: []};

        //console.log('>> s7Client.MBRead');
        client.MBRead(this.settings.mStart, this.settings.mSize, function(err, res) {
            if (err) {
                let error = 'MBRead failed. Code #' + err + ' - ' + client.ErrorText(err);
                self.emit('error', error)
                return;
            }

            for (let value of res.values()) {
                data.m.push(value);
            }
            console.log(data);
            self.emit('m', data);
        });
    };

    readDB() {
        const self = this;
        let data = { dbValues: []};

        //console.log('>> s7Client.readDB');
        client.DBRead(this.settings.DBNumber, this.settings.DBStart, this.settings.DBSize, function(err, res) {
            if (err) {
                let error = 'DBRead failed. Code #' + err + ' - ' + client.ErrorText(err);
                self.emit('error', error)
                return;
            }

            for (let value of res.values()) {
                data.dbValues.push(value);
            }
            console.log(data);
            self.emit('db', data);
        });
    };

    writeDO(bytes) {
        const self = this;
        var buf = new Buffer(bytes);

        //console.log('>> s7Client.writeDO');
        client.ABWrite(this.settings.doStart, buf.length, buf, function(err) {
            if (err) {
                let error = 'ABWrite failed. Code #' + err + ' - ' + client.ErrorText(err);
                self.emit('error', error)
            }
        });
    };

    writeM(bytes) {
        const self = this;
        var buf = new Buffer(bytes);

        //console.log('>> s7Client.writeM');
        client.MBWrite(this.settings.mStart, buf.length, buf, function(err) {
            if (err) {
                let error = 'MBWrite failed. Code #' + err + ' - ' + client.ErrorText(err);
                self.emit('error', error)
            }
        });
    };

}

module.exports = S7Client;
