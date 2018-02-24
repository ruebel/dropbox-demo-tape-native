import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';
import { Switch, Route } from 'react-router-native';

import IconButton from './IconButton';
import Loading from './Loading';

const TitleWrapper = styled.View`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
`;

const Wrapper = styled.View`
  align-items: center;
  background-color: ${p => p.theme.color.secondary};
  flex-direction: row;
  justify-content: center;
  padding-top: ${p => p.theme.size.statusBarHeight};
`;

const Header = ({ theme }) => {
  const iconColor = theme.color.textSecondary;
  return (
    <Wrapper>
      <Switch>
        <Route
          exact
          path="/"
          render={({ match, history, location }) => (
            <IconButton
              color={iconColor}
              icon="add"
              onPress={() => history.push('/create')}
            />
          )}
        />
        <Route
          render={({ match, history, location }) => (
            <IconButton
              color={iconColor}
              icon="chevron-left"
              onPress={history.goBack}
            />
          )}
        />
      </Switch>
      <TitleWrapper>
        <Loading color={iconColor} />
      </TitleWrapper>
      <Switch>
        <Route
          exact
          path="/menu"
          render={({ match, history, location }) => (
            <IconButton
              color={iconColor}
              icon="close"
              onPress={history.goBack}
            />
          )}
        />
        <Route
          render={({ match, history, location }) => (
            <IconButton
              color={iconColor}
              icon="menu"
              onPress={() => history.push('/menu')}
            />
          )}
        />
      </Switch>
    </Wrapper>
  );
};

Header.propTypes = {
  theme: PropTypes.object
};

export default withTheme(Header);
