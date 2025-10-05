
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";



const Notification = () => {


    return (
        <ToastContainer
            position='bottom-center'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='dark'
            rtl={false}
        />
    )
}

export default Notification