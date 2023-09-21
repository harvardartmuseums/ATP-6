
const { Server } = require('socket.io');

module.exports.listen = function(server, app){
    const io = new Server(server);

    let settings = app.get('settings');

    let windowSockets = io.of('/window');
    let controllerSockets = io.of('/controller');
    let historySockets = io.of('/history');    
    let mcpSockets = io.of('/mcp');
    
    windowSockets.on('connection', function(socket) {
        console.log('screen socket connected');
        
        socket.emit('start up', settings);
        
        settings.addWindow(0);
        historySockets.emit('update', settings);
        mcpSockets.emit('update', settings);

        socket.on('take-action', data => {
            if (data.action === 'spawn') {
                settings.addSun(data.packet);
                mcpSockets.emit('update', settings);
            } else if (data.action === 'snapshot complete') {
                settings.addSnapshot(data.packet);
                mcpSockets.emit('update', settings);
            }
        });

        socket.on('disconnect', function() {
            settings.removeWindow(0);
            historySockets.emit('update', settings);
            mcpSockets.emit('update', settings);
            console.log('screen socket disconnect')
        });
    });
    
    controllerSockets.on('connection', function(socket) {
        console.log('controller socket connected');
        
        socket.emit('start up', settings);

        settings.addController(0);
        historySockets.emit('update', settings);
        mcpSockets.emit('update', settings);

        socket.on('take-action', data => {
            windowSockets.emit(data.action, data.packet);

            if (data.action === 'cast') {
                settings.addTree(data.packet);
                mcpSockets.emit('update', settings);
            }
        })

        socket.on('disconnect', function() {
            settings.removeController(0);
            historySockets.emit('update', settings);
            mcpSockets.emit('update', settings);
            console.log('controller socket disconnect')
        });
    });
    
    historySockets.on('connection', function(socket) {
        historySockets.emit('update', settings);
    });

    mcpSockets.on('connection', function(socket) {
        mcpSockets.emit('start up', settings);

        socket.on('take-action', data => {
            if (data.destination) {
                if (data.destination === 'window') {
                    if (data.action === 'set-density') {
                        settings.treeDensity = data.packet.density;
                        mcpSockets.emit('update', settings);
                    }
                    if (data.action === 'set-time-of-day') {
                        settings.timeOfDay = data.packet.hour;
                        mcpSockets.emit('update', settings);
                    }
                    windowSockets.emit(data.action, data.packet);
                } else if (data.destination === 'controller') {
                    if (data.action === 'set-collection') {
                        settings.currentCollection = data.packet;
                    }
                    controllerSockets.emit(data.action, data.packet);
                }
            }
        });

        socket.on('disconnect', function() {

        });
    });

    return io;
}