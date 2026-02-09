import sys
import json
import struct
import shutil
import os
import tkinter as tk
from tkinter import filedialog

def send_message(message):
    encoded_content = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('@I', len(encoded_content)))
    sys.stdout.buffer.write(encoded_content)
    sys.stdout.buffer.flush()

def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length: sys.exit(0)
    message_length = struct.unpack('@I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def pick_folder():
    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True)
    folder_path = filedialog.askdirectory()
    root.destroy()
    return folder_path

def move_file(filename, destination_folder):
    downloads_path = os.path.expanduser("~/Downloads")
    source = os.path.join(downloads_path, filename)
    
    if not os.path.exists(source):
        return {"status": "error", "code": "NOT_FOUND"}
        
    try:
        shutil.move(source, os.path.join(destination_folder, filename))
        # Return strict JSON. No messages.
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "code": str(e)}

while True:
    try:
        msg = read_message()
        action = msg.get('action')
        
        if action == 'pick_folder':
            path = pick_folder()
            send_message({"path": path})
        
        elif action == 'move_file':
            result = move_file(msg['filename'], msg['destination'])
            send_message(result)
        
        elif action == 'open_file':
            downloads_path = os.path.expanduser("~/Downloads")
            file_path = os.path.join(downloads_path, msg['filename'])
            if os.path.exists(file_path):
                os.startfile(file_path)
                send_message({"status": "success"})
            else:
                send_message({"status": "error", "code": "NOT_FOUND"})
        
        elif action == 'pick_and_move':
            # Combined action: pick folder then move file
            path = pick_folder()
            if path:
                result = move_file(msg['filename'], path)
                result['path'] = path
                send_message(result)
            else:
                send_message({"status": "cancelled"})
    except:
        pass