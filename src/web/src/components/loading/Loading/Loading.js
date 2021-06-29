import { PlusIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

import { Container, ItemLg, ItemNew, ItemXl, ItemXxl, Text } from '@/components/loading/Loading/Loading.styles'

export const Loading = ({ color }) => (
  <Container color={color}>
    <ItemXxl />
    <ItemXl />
    <ItemLg />
    <ItemNew>
      <PlusIcon />
      &nbsp;
      <span>Add another list</span>
    </ItemNew>
    <Text>Loading...</Text>
  </Container>
)

Loading.propTypes = {
  color: PropTypes.string.isRequired,
}

Loading.defaultProps = {
  color: 'sky',
}
