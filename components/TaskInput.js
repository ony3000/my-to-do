import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { createTodoItem } from '../store/todoSlice';
import styles from './TaskInput.module.scss';

const cx = classNames.bind(styles);

class TaskInput extends React.Component {
  constructor(props) {
    super(props);

    this.$refs = {
      input: React.createRef(),
    };
  }

  render() {
    return (
      <div className={cx('container')}>
        {/* 테마 색상 */}
        <button
          className={cx('button', 'is-left')}
          title="작업 추가"
          onClick={() => this.$refs.input.current.focus()}
        >
          <span className={cx('icon-wrapper')}>
            <i className="fas fa-plus"></i>
            <span className="sr-only">작업 추가</span>
          </span>
        </button>

        {/* 엔터 입력 또는 input blur 시, trim 결과가 비어있지 않으면 작업 추가 */}
        <input
          ref={this.$refs.input}
          className={cx('input')}
          type="text"
          placeholder={this.props.placeholder ?? '작업 추가'}
          data-is-empty={true}
          onKeyUp={e => this.keyUpHandler(e)}
          onInput={e => this.inputHandler(e)}
          onBlur={e => this.blurHandler(e)}
        />

        {/* 테마 색상, 작업 입력창의 값이 비어있지 않을 때만 노출됨 */}
        <button
          className={cx('button', 'is-right', 'is-submit')}
          title="추가"
          onClick={() => this.createTask()}
        >
          <span className={cx('icon-wrapper')}>
            <span>추가</span>
          </span>
        </button>
      </div>
    );
  }

  keyUpHandler(e) {
    if (e.key === 'Enter') {
      this.createTask();

      setTimeout(() => this.$refs.input.current.focus());
    }
  }

  inputHandler(e) {
    const inputElement = e.target;
    const isInputEmpty = (inputElement.value === '');

    if (inputElement.dataset.isEmpty !== String(isInputEmpty)) {
      inputElement.dataset.isEmpty = isInputEmpty;
    }
  }

  blurHandler(e) {
    const inputElement = e.target;
    const trimmedTitle = inputElement.value.trim();

    if (trimmedTitle) {
      this.createTask();
    }
  }

  createTask() {
    const { dispatch } = this.props;
    const trimmedTitle = this.$refs.input.current.value.trim();

    if (trimmedTitle) {
      dispatch(createTodoItem({
        title: trimmedTitle,
        ...this.props.itemProps,
      }));

      this.$refs.input.current.value = '';
    }
  }
}

export default connect()(TaskInput);
