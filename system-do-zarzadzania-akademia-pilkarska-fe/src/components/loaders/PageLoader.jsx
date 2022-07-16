import React from "react"
import { motion } from "framer-motion"
const PageLoader = () => {
    const loaderVariants ={
        animationOne:{
            x:[-20,20],
            y:[0,-30],
            transition:{
                x:{
                    yoyo:Infinity,
                    duration:0.5
                },
                y:{
                    yoyo:Infinity,
                    duration:0.25,
                    ease: 'easeOut'
                },
                
            }
        }
    }
    
    return(
        <div className="loader-container">
        <motion.div className="loader"
        variants ={loaderVariants}
        animate ="animationOne">
        </motion.div>
       <label htmlFor="loader-text">Ładowanie danych</label>
        </div>
    )
}

export default PageLoader