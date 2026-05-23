import TableModel from "../Models/TableRowData.js";



const getAllList=async (req,res) => {
    try {
        const List= await TableModel.find();
        res.json(List);
    } catch (error) {
        console.log(`Failed to Get Data due to this ${error}`);
        
    }
}
const newList=async (req,res) => {
    try {
        const NewList=req.body;
        const NewItem=new TableModel(NewList);
        await NewItem.save();
        

    } catch (error) {
        console.log(`Failed To add New List Due to This ${error}`);
        
    }
}
const upDateList=async (params) => {
    try {
        const id=req.params;
        const updatedData=req.body;
        const UpdateList=await TableModel.findByIdAndUpdate(id,updatedData)
        if (!UpdateList) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json(UpdateList);
    } catch (error) {
        console.log(`This is the Erorr name ${error}`);
        
    }
}
const deleteList=async(req,res)=>{
    try{
        const id=req.params;
        const DeletedItem=await TableModel.findByIdAndDelete(id);
        
    }
    catch(error){
        console.log(`Errror Message You Get ${error}`);
        
    }
}
export {deleteList,getAllList,upDateList,newList}