import React from "react";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Menu from "./Menu";
import "../../styles/Layout.css";
import PropTypes from 'prop-types';

interface LayoutProps {
    title?: string;
    description?: string;
    className?: any;
    children?: any;
}

export const Layout: React.FC<LayoutProps & RouteComponentProps> = ({
    title = "Title",
    description = "Description",
    className,
    children
}) => (
        <div id="Layout">
            <div className="jumbotron">
                <h2>{title}</h2>
                <p className="lead">{description}</p>
            </div>
            <div className={className}>{children}</div>
        </div>
    );
export default withRouter(Layout);
