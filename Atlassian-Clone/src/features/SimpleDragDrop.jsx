import React from 'react'

const SimpleDragDrop = () => {
    const {columns,setColumns}=useState({
        todo:[],
        tasks:[]
    })
    const handleDrop=(key)=>{
        console.log(key);
        
    }
  return (
    <div>
    {
        Object.entries(columns).map(([key,index])=>{
            return(
                <div key={key}
                onDragOver={(e)=>{e.preventDefault()}}
                onDrop={handleDrop(key)
            
                }
                >
                <h2>{key}</h2>
                <div>

                </div>
                </div>
            )
        })
    }
    </div>
  )
}

export default SimpleDragDrop
