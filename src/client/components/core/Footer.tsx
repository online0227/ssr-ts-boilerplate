import React from "react";
import { withRouter } from 'react-router-dom';

const Footer = () => (
    <div id="contact" className="offset">
        <footer>
            <div className="row">

                <div className="col-md-5">
                    <img src="/public/img/logo.png" alt="" />
                    <p>Please email to the admin if you need any helps for any reasons regarding the website. You can email manually, or use the form here.</p>
                    <strong>Contact Info</strong>
                    <p>admin@website.com</p>
                    <a href="#"><i className="fab fa-facebook-square"></i></a>
                    <a href="#"><i className="fab fa-twitter-square"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-reddit-square"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                </div>

                <div className="col-md-7">
                    <h3>Contact</h3>

                    <form id="contact-form" method="post" action="/">

                        <div className="messages"></div>
                        <div className="controls">

                            <div className="form-group">
                                <input id="form_name" type="text" name="name" className="form-control" placeholder="Enter your name." required />
                            </div>

                            <div className="form-group">
                                <input id="form_email" type="email" name="email" className="form-control" placeholder="Enter your email." required />
                            </div>

                            <div className="form-group">
                                <textarea id="form_message" name="message" className="form-control" placeholder="Add your message." rows={4} required ></textarea>
                            </div>

                            <input type="submit" className="btn btn-outline-light btn-sm" value="Send message" />
                        </div>
                    </form>
                </div>
                <hr className="socket" />
                &copy; SSR-boilerplate.
        </div>
        </footer>
    </div>
);

export default withRouter(Footer);
