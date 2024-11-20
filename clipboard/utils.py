
# Generate new key
def generate_key(clipboard):
    if not clipboard:
        return 1
    else:
        latest_key = max(clipboard.keys())
    return int(latest_key) + 1 if latest_key else 1


# Generate clipboard data from the database
def generate_clipboard(snapshot):
    if not snapshot:
        return {}

    # remove null in snapshot list
    snapshot_i = list(filter(None, snapshot))


    # create a dict to store the clipboard data
    clipboard = {}

    # refactor the data to a dict
    for clip in snapshot_i:
        try:
            if snapshot[clip] is None:
                clipboard[clip] = None
            else:
                clipboard[clip] = snapshot[clip]["data"]
        except:
            print(clip)

    return clipboard