import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Box, ButtonBase, Menu, MenuItem, SvgIcon } from '@mui/material';
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import AddIcon from '@mui/icons-material/Add';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { useRouter } from 'next/router';

function YourComponent({ onClose }) {
  const router = useRouter();

  const handleItemClick = (path) => {
    router.push(path);
    onClose(); // 关闭菜单
  };

  return (
    <>
      <MenuItem onClick={() => handleItemClick('/hitrecord')}>打擊數據</MenuItem>
      <MenuItem onClick={() => handleItemClick('/defendrecord')}>投球數據</MenuItem>
      <MenuItem onClick={() => handleItemClick('/rank')}>各項排名</MenuItem>
      <MenuItem onClick={() => handleItemClick('/vsteam')}>球隊比較</MenuItem>
      <MenuItem onClick={() => handleItemClick('/vsplayer')}>球員比較</MenuItem>
      <MenuItem onClick={() => handleItemClick('/personal-data')}>個人數據</MenuItem>
    </>
  );
}

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const linkProps = path
    ? external
      ? {
        component: 'a',
        href: path,
        target: '_blank'
      }
      : {
        component: NextLink,
        href: path
      }
    : {};

  return (
    <li>
      {title === '數據' ? (
        <>
          <ButtonBase
            onClick={handleOpenMenu}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'flex-start',
              pl: '16px',
              pr: '16px',
              py: '6px',
              textAlign: 'left',
              width: '100%',
              ...(active && {
                backgroundColor: 'rgba(255, 255, 255, 0.04)'
              }),
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)'
              }
            }}
          >
            {icon && (
              <Box
                component="span"
                sx={{
                  alignItems: 'center',
                  color: 'neutral.400',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  mr: 2,
                  ...(active && {
                    color: 'primary.main'
                  })
                }}
              >
                {icon}
              </Box>
            )}
            <Box
              component="span"
              sx={{
                color: 'neutral.400',
                flexGrow: 1,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: 14,
                fontWeight: 600,
                lineHeight: '24px',
                whiteSpace: 'nowrap',
                ...(active && {
                  color: 'common.white'
                }),
                ...(disabled && {
                  color: 'neutral.500'
                })
              }}
            >
              {title}
            </Box>
          </ButtonBase>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <YourComponent onClose={handleCloseMenu} />
          </Menu>
        </>
      ) : (
        <ButtonBase
          sx={{
            alignItems: 'center',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            pl: '16px',
            pr: '16px',
            py: '6px',
            textAlign: 'left',
            width: '100%',
            ...(active && {
              backgroundColor: 'rgba(255, 255, 255, 0.04)'
            }),
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.04)'
            }
          }}
          {...linkProps}
        >
          {icon && (
            <Box
              component="span"
              sx={{
                alignItems: 'center',
                color: 'neutral.400',
                display: 'inline-flex',
                justifyContent: 'center',
                mr: 2,
                ...(active && {
                  color: 'primary.main'
                })
              }}
            >
              {icon}
            </Box>
          )}
          <Box
            component="span"
            sx={{
              color: 'neutral.400',
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: '24px',
              whiteSpace: 'nowrap',
              ...(active && {
                color: 'common.white'
              }),
              ...(disabled && {
                color: 'neutral.500'
              })
            }}
          >
            {title}
          </Box>
        </ButtonBase>
      )}
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired
};
