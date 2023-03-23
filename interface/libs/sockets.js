
const { Server } = require('socket.io');

module.exports.listen = function(app){
    const io = new Server(app);

    let windowSockets = io.of('/window');
    let controllerSockets = io.of('/controller');
    
    
    windowSockets.on('connection', function(socket) {
        console.log('screen socket connected');
        
        //socket.emit('start up', 'value');
        
        socket.on('disconnect', function() {
            console.log('screen socket disconnect')
        });
    });
    
    controllerSockets.on('connection', function(socket) {
        console.log('controller socket connected');
        
        //socket.emit('start up', 'value');

        socket.on('take-action', data => {
            windowSockets.emit(data.action, data.packet);
        })

        socket.on('disconnect', function() {
            console.log('controller socket disconnect')
        });
    });
    
    return io;
}