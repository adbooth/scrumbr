""" scrumtious/socket.py
"""
from flask_socketio import emit, join_room

from scrumtious import socketio, mongo
from scrumtious.Memory import Memory

mem = Memory()

@socketio.on('ts_HANDSHAKE')
def handshake(boardId):
    # Populate board if not already populated
    if not mem.boardIsActive(boardId):
        mem.populateBoard(mongo.db.boards.find_one({'boardId': boardId}))

    # Increment user count
    mem.addUser(boardId)

    # Join room and send initialization data
    join_room(boardId)
    emit('tc_INITIALIZE', mem.getBoard(boardId))

@socketio.on('ts_NEW_NOTE')
def newNote(payload):
    # Make new data fields in memory
    boardId = payload['boardId']
    nid = mem.newNote(boardId, payload['xr'], payload['yr'])

    # Send new note signal to board users
    emit('tc_NEW_NOTE', mem.getNote(boardId, nid), room=boardId)

@socketio.on('ts_CHANGE_NOTE')
def changeNote(payload):
    # Update data fields in memory
    boardId = payload['boardId']
    nid = payload['nid']
    mem.changeNote(boardId, nid, payload['content'])

    # Send new data
    noteData = mem.getNote(boardId, nid)
    emit('tc_CHANGE_NOTE', {
        'nid': nid,
        'content': noteData['content']
    }, room=boardId)

@socketio.on('ts_MOVE_NOTE')
def moveNote(payload):
    # Update data fields in memory
    boardId = payload['boardId']
    nid = payload['nid']
    mem.moveNote(boardId, nid, payload['xr'], payload['yr'])

    # Send new data
    noteData = mem.getNote(boardId, nid)
    emit('tc_MOVE_NOTE', {
        'nid': nid,
        'xr': noteData['xr'],
        'yr': noteData['yr']
    }, room=boardId)

@socketio.on('ts_DELETE_NOTE')
def deleteNote(payload):
    # Update data fields in memory
    boardId = payload['boardId']
    nid = payload['nid']
    mem.deleteNote(boardId, nid)

    # Send new data
    emit('tc_DELETE_NOTE', nid, room=boardId)

@socketio.on('ts_CLOSE')
def close(boardId):
    # Decrement user count
    mem.removeUser(boardId)

    # If last user, store final memory state on database
    if not mem.boardIsActive(boardId):
        mongo.db.boards.replace_one({'boardId': boardId}, mem.getBoard(boardId))
        mem.eraseBoard(boardId)
