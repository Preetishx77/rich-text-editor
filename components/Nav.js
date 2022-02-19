import React from 'react'
import { Container, Navbar, NavbarBrand } from 'react-bootstrap'
import logo from '../logo-02 1.png'
import cog from '../Cog.svg'
import Image from 'next/image'


const Nav = () => {
    return (<>
        <Navbar style={{ backgroundColor: '#FAFBFC' }}>
            <Container fluid>
                <NavbarBrand className='px-3' style={{ borderRight: '1px solid #E6E6E6' }}>
                    <Image src={logo} alt="logo" className='mx-auto px-auto' />
                </NavbarBrand>
                <h4 style={{ fontWeight: '500' }}>Data</h4>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <div className="px-2 py-1" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                        <Image src={cog} alt="logo" width='' className='' />
                    </div>
               </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
    )
}

export default Nav