const express=require('express');
const router=express.Router();
const applianceModel=require('../models/appliances.js')


router.post('/create-appliance',async(req,res)=>{
    const {name,id}=req.body;

    if(!name || !id )
    {
       return res.status(400).json({success:false,message:'Field cannot be empty!'});
    }
    try
    {
        const exist=await applianceModel.findOne({"userid":id,name:name});
        if(exist)
            {
                return res.status(400).json({success:false,message:'Appliance already present!'});
            }
         
            await applianceModel.create({userid:id,name:name});

        return res.status(200).json({success:true,message:'Appliance created!'});
    }
    catch(error)
    {
        return res.status(500).json({success:false,message:error});
    }

})



router.post('/control-appliance',async(req,res)=>{
    const {status,id}=req.body;

    console.log('stat',status,id);
    if(status==null || !id )
    {
       return res.status(400).json({success:false,message:'Field cannot be empty!'});
    }
    try
    {
        const exist=applianceModel.findOne({userid:id});
        if(!exist)
            return res.status(400).json({success:false,message:'No appliance found with associated id!'});

        // console.log('exist',exist);
        await applianceModel.updateMany({userid:id},{$set:{status}})

        return res.status(200).json({success:true,message:'All Appliances turned on!'});
    }
    catch(error)
    {
              console.log(error,'ero')
        return res.status(500).json({success:false,message:error});
    }

})

router.get('/appliances', async (req, res) => {
    const {id}=req.query;
    if(!id)
    return res.status(400).json({success:false,message:'No id found'});

    try{
        const appliances = await applianceModel.find({ userid: req.query.id });

        if(appliances.length<1)
            return res.status(400).json({success:false,message:'No appliances found!'});

        return res.status(200).json({success:true,message:'All Appliances fetched!',data:appliances});
    }
    catch(error)
    {
        return res.status(500).json({success:false,message:error});
    }
});

module.exports=router;