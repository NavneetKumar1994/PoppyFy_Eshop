import React, {Fragment} from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'

function ProtectedRoute({isAdmin, component: Component, ...rest}) {

     const navigate = useNavigate();

     const {isAuthenticated, loading, user} = useSelector(state=> state.auth);

  return (
     <Fragment>
          { loading=== false && (
               <Routes>
                     <Route
                    {...rest}
                    render={props => {
                        if (isAuthenticated === false) {
                           navigate('/login')
                        }

                        if (isAdmin === true && user.role !== 'admin') {
                            navigate('/');
                        }

                        return <Component {...props} />
                    }}
                />
               </Routes>
                     
          )}

     </Fragment>

  )
}

export default ProtectedRoute