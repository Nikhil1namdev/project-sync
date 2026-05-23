import CreatingProjectModel from "../Models/Creatingproject";

const getAllProjects =async(params)=>{
    const {name,description,template, projectId }=req.params;

    const projectList =new CreatingProjectModel({name,description,template,projectId})
   await projectList.save()
    
}