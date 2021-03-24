import React from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { openSearchBox, closeSearchBox } from '@/store/todoSlice';
import styles from './SearchBox.module.scss';

const cx = classNames.bind(styles);

const mapStateToProps = ({ todo: state }) => ({
  isActiveSearchBox: state.isActiveSearchBox,
});

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.$refs = {
      input: React.createRef(),
    };
  }

  render() {
    const { isActiveSearchBox } = this.props;

    return (
      <div
        className={cx(
          'container',
          { 'is-active': isActiveSearchBox },
        )}
      >
        <button
          className={cx('button', 'is-opener')}
          title="검색"
          onClick={() => this.open()}
        >
          <span className={cx('icon-wrapper')}>
            <i className="fas fa-search"></i>
            <span className="sr-only">검색</span>
          </span>
        </button>
        <input
          ref={this.$refs.input}
          className={cx('input')}
          type="text"
          placeholder="검색"
          disabled={!isActiveSearchBox}
          onInput={e => this.inputHandler(e)}
          onBlur={e => this.blurHandler(e)}
        />
        <button
          className={cx('button', 'is-closer')}
          title="검색 종료"
          disabled={!isActiveSearchBox}
          onClick={() => this.close()}
        >
          <span className={cx('icon-wrapper')}>
            <i className="fas fa-times"></i>
            <span className="sr-only">검색 종료</span>
          </span>
        </button>
      </div>
    );
  }

  open() {
    const { dispatch, isActiveSearchBox } = this.props;

    if (!isActiveSearchBox) {
      dispatch(openSearchBox());
    }

    setTimeout(() => this.$refs.input.current.focus());
  }

  close() {
    const { dispatch, isActiveSearchBox } = this.props;

    this.$refs.input.current.value = '';

    if (isActiveSearchBox) {
      dispatch(closeSearchBox());
    }
  }

  inputHandler(e) {
    const inputElement = e.target;
    const encodedKeyword = encodeURIComponent(inputElement.value);

    if (encodedKeyword) {
      console.log(`Route URL to [/tasks/search/${encodedKeyword}]`);
    }
    else {
      console.log(`Route URL to [/tasks/search]`);
    }
  }

  blurHandler(e) {
    const inputElement = e.target;

    if (!inputElement.value) {
      this.close();
    }
  }
}

export default connect(mapStateToProps)(SearchBox);
