export function getAllNotes(req, res){
    res.status(200).send("you just fetched notes")
}

export function createNote(){
    res.status(200).json({message: "note posted successfully"})
}

export function updateNote(req, res) {
    res.status(200).json("notes updated succssfully")
}

export function deleteNote(req,res) {
    res.status(200).json({message: "note deleted succesfully"})
}