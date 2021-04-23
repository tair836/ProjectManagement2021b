const { Router }=require('express')
const HR=require('../controllers/AuthloginHRController')
const Employer=require('../controllers/AuthEmployerController')
const Contractor=require('../controllers/AuthContractorController')

const router=Router()

//HR
router.get('/loginHR',HR.loginHRGet)
router.post('/loginHR',HR.loginHRPost)

router.post('/createNewHR',HR.createNewHRPost)


//employer
router.get('/loginEmployer',Employer.loginEmployerGet)
router.post('/loginEmployer',Employer.loginEmployerPost)
router.get('/signupEmployer',Employer.signupEmployerGet)

router.post('/createNewEmp',Employer.createNewEmpPost)


//contractors
router.get('/loginContractor',Contractor.loginContractorGet)
router.post('/loginContractor',Contractor.loginContractorPost)

router.post('/createNewContractor',Contractor.createNewContractorPost)



//logout
router.get('/logout',HR.logoutGet)


module.exports=router