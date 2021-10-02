import styled, {css, keyframes} from "styled-components";
import React from "react";

const translate = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-150vw, 0);
  }
`

const bannerCss = css`
  animation: ${translate} ${props => props.scrollTime || 45}s linear infinite;
  //background: rgba(0, 0, 0, .65);
  background-color: #2f3136;
  left: 0;
  position: absolute;
  width: 150vw;
  display: grid;
  font-weight: bold;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
`

const BannerContainer = styled.div`
  ${bannerCss};
  top: ${props => props.placement === 'top' ? 0 : 'auto'};
  bottom: ${props => props.placement === 'bottom' ? 0 : 'auto'};
  margin-left: 0;
`

const BannerContainerOffset = styled.div`
  ${bannerCss};
  top: ${props => props.placement === 'top' ? 0 : 'auto'};
  bottom: ${props => props.placement === 'bottom' ? 0 : 'auto'};
  margin-left: 149.9vw;
`

export function Banner({children, scrollTime, placement}) {
    const numChildren = React.Children.count(children);
    return (
        <div>
            <BannerContainer placement={placement} columns={numChildren} scrollTime={scrollTime}>
                {children}
            </BannerContainer>

            <BannerContainerOffset placement={placement} columns={numChildren} scrollTime={scrollTime}>
                {children}
            </BannerContainerOffset>
        </div>
    )
}
