import './Modal.scss';

const Modal = (props) => {
  const findByKey = (name) =>
    props.children.map((child) => {
      if (child.key === name) {
        return child;
      }
    });

  return (
    <div className='modal-mask modal-close'>
      <div className='modal-wrapper'>
        <div className='modal-container'>
          <div className='modal-header'>{findByKey('header')}</div>
          <div className='modal-body'>{findByKey('body')}</div>
          <div className='modal-footer'>{findByKey('footer')}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
