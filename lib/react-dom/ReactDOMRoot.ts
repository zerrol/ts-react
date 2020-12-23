import { Container } from './index'
import { RootTag } from '@/shared/constants'
import FiberRoot from '@/react-reconciler/FiberRoot'

export default class {
  _internalRoot: FiberRoot

  constructor(container: Container, tag: RootTag) {
    this._internalRoot = FiberRoot.create(container, tag)
  }

  render = () => {
    // ...render
  }

  unmount = () => {
    // ...unmount
  }
}