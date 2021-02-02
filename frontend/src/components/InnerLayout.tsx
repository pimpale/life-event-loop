import React from 'react';
import { SvgIconComponent, ExitToApp, Menu } from '@material-ui/icons';

// Bootstrap CSS & Js
import '../style/dashboard.scss';

const iconStyle = {
  width: "2rem",
  height: "2rem",
};

const InnerLayoutContext = React.createContext<boolean>(true)

interface SidebarEntryProps {
  label: string,
  icon: SvgIconComponent,
  href: string,
}

const SidebarEntry: React.FunctionComponent<SidebarEntryProps> = props => {
  const style = {
    color: "#fff"
  }
  const Icon = props.icon;
  if (React.useContext(InnerLayoutContext)) {
    // collapsed
    return <a style={style} className="nav-item nav-link" href={props.href}>
      <Icon style={iconStyle} />
    </a>
  } else {
    // not collapsed
    return <a style={style} className="nav-item nav-link" href={props.href}>
      <Icon style={iconStyle} /> {props.label}
    </a>
  }
}

const Body: React.FunctionComponent = props => <> {props.children} </>

interface InnerLayoutComposition {
  SidebarEntry: React.FunctionComponent<SidebarEntryProps>
  Body: React.FunctionComponent 
}

interface InnerLayoutProps {
  name: string
  logoutCallback: () => void
}

const InnerLayout: React.FunctionComponent<React.PropsWithChildren<InnerLayoutProps>> & InnerLayoutComposition =
  props => {
    let [collapsed, setCollapsed] = React.useState<boolean>(true);

    const widthrem = collapsed ? 4 : 15;

    const sidebarStyle = {
      height: "100%",
      width: `${widthrem}rem`,
      position: "fixed" as const,
      top: 0,
      left: 0,
      overflowX: "hidden" as const,
      overflowY: "hidden" as const,
      margin: "0%"
    };

    const sidebarBottom = {
      position: 'absolute' as const,
      bottom: 0,
      right: 0,
      left: 0,
    };

    let sidebarChildren: React.ReactElement[] = [];
    let nonSidebarChildren: React.ReactNode[] = [];

    React.Children.forEach(props.children, child => {
      if (React.isValidElement(child)) {
        if (child.type === SidebarEntry) {
          sidebarChildren.push(child);
        } else if (child.type === Body) {
          nonSidebarChildren.push(child);
        }
      }
    });

    return (
      <InnerLayoutContext.Provider value={collapsed}>
        <div>
          <nav className="bg-dark text-light" style={sidebarStyle}>
            <div className="nav-item nav-link">
            <Menu style={iconStyle} onClick={_ => setCollapsed(!collapsed)} />
            </div>
            {
              collapsed
                ? ""
                : <div className="nav-item nav-link mx-auto my-3">
                  <h6>Welcome, {props.name}</h6>
                </div>
            }
            {sidebarChildren}
            <div style={sidebarBottom}>
              <button
                style={{ color: "#fff" }}
                type="button"
                className="btn nav-item nav-link"
                onClick={() => props.logoutCallback()}
              >
                <ExitToApp style={iconStyle} /> {collapsed ? "" : "Log Out"}
              </button>
            </div>
          </nav>
          <div style={{ marginLeft: `${widthrem}rem` }}>
            {nonSidebarChildren}
          </div>
        </div>
      </InnerLayoutContext.Provider>
    )
  }

InnerLayout.SidebarEntry = SidebarEntry;
InnerLayout.Body = Body;

export default InnerLayout;
