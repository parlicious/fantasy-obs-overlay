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
  background: rgba(0, 0, 0, .65);
  position: absolute;
  width: 150vw;
  display: grid;
  font-weight: bold;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
`

const BannerContainer = styled.div`
  ${bannerCss};
  margin-left: 0;
`

const BannerContainerOffset = styled.div`
  ${bannerCss};
  margin-left: 150vw;
`

export function Banner({children, scrollTime}) {
    const numChildren = React.Children.count(children);
    return (
        <div>
            <BannerContainer columns={numChildren} scrollTime={scrollTime}>
                {children}
            </BannerContainer>

            <BannerContainerOffset columns={numChildren} scrollTime={scrollTime}>
                {children}
            </BannerContainerOffset>
        </div>
    )
}