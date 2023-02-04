import Image from 'next/image';
import invariant from 'tiny-invariant';
import classNames from 'classnames';
import { ToggleButton } from '@/components/button';
import { IconContainer } from '@/components/layout';
import { isOneOf } from '@/lib/types/guard';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/index';
import {
  closeSettingPanel,
  turnOnGeneral,
  turnOffGeneral,
  turnOnSmartList,
  turnOffSmartList,
} from '@/lib/store/todoSlice';

export default function SettingPanel() {
  const dispatch = useAppDispatch();
  const isActiveSettingPanel = useAppSelector(({ todo: state }) => state.isActiveSettingPanel);
  const generalSettings = useAppSelector(({ todo: state }) => state.settings.general);
  const smartListSettings = useAppSelector(({ todo: state }) => state.settings.smartList);

  const generals = [
    {
      key: 'confirmBeforeRemoving',
      text: '삭제하기 전에 확인',
    },
    {
      key: 'moveImportantTask',
      text: '별표 표시된 작업을 상단으로 이동',
    },
  ];
  const smartLists = [
    {
      key: 'important',
      text: '중요',
    },
    {
      key: 'planned',
      text: '계획된 일정',
    },
    {
      key: 'all',
      text: '모두',
    },
    {
      key: 'completed',
      text: '완료됨',
    },
    {
      key: 'autoHideEmptyLists',
      text: '빈 스마트 목록 자동 숨김',
    },
  ];

  const buttonClassNames =
    'absolute top-3 right-1 inline-flex h-10 w-10 items-center p-1 text-gray-600 hover:bg-gray-200';

  return (
    <div
      className={classNames(
        'absolute top-12 right-0 box-content h-[calc(100vh-48px)] overflow-y-auto overflow-x-hidden border-l border-solid border-gray-200 bg-gray-50 shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-200',
        { 'z-[-1] w-[280px] opacity-0 min-[400px]:w-80': !isActiveSettingPanel },
        { 'z-[5000] w-80 opacity-100 min-[400px]:w-[360px]': isActiveSettingPanel },
      )}
    >
      <div
        className={classNames(
          'transition-transform duration-200',
          { 'translate-x-20': !isActiveSettingPanel },
          { 'translate-x-0': isActiveSettingPanel },
        )}
      >
        <h1 className="inline-flex px-4 py-5 text-xl font-semibold">설정</h1>

        <div className="px-4">
          <div className="pb-2.5">
            <h2 className="py-2 text-[18px] font-semibold">일반</h2>

            <div className="flex flex-col items-start space-y-4 py-2">
              {generals.map((generalItem) => {
                invariant(isOneOf(generalItem.key, ['confirmBeforeRemoving', 'moveImportantTask']));

                const isActiveGeneral = generalSettings[generalItem.key];
                const conditionalAction = isActiveGeneral
                  ? turnOffGeneral(generalItem.key)
                  : turnOnGeneral(generalItem.key);

                return (
                  <div key={generalItem.key} className="flex flex-col">
                    <div className="py-1 text-[14px] font-semibold">{generalItem.text}</div>
                    <div className="inline-flex">
                      <ToggleButton
                        disabled={!isActiveSettingPanel}
                        isActive={isActiveGeneral}
                        onToggle={() => dispatch(conditionalAction)}
                      />
                      <div className="mx-2 text-[14px]">{isActiveGeneral ? '켬' : '끔'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pb-2.5">
            <h2 className="py-2 text-[18px] font-semibold">스마트 목록</h2>

            <div className="flex flex-col items-start space-y-4 py-2">
              {smartLists.map((smartListItem) => {
                invariant(
                  isOneOf(smartListItem.key, [
                    'important',
                    'planned',
                    'all',
                    'completed',
                    'autoHideEmptyLists',
                  ]),
                );

                const isActiveSmartList = smartListSettings[smartListItem.key];
                const conditionalAction = isActiveSmartList
                  ? turnOffSmartList(smartListItem.key)
                  : turnOnSmartList(smartListItem.key);

                return (
                  <div key={smartListItem.key} className="flex flex-col">
                    <div className="py-1 text-[14px] font-semibold">{smartListItem.text}</div>
                    <div className="inline-flex">
                      <ToggleButton
                        disabled={!isActiveSettingPanel}
                        isActive={isActiveSmartList}
                        onToggle={() => dispatch(conditionalAction)}
                      />
                      <div className="mx-2 text-[14px]">{isActiveSmartList ? '켬' : '끔'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pb-2.5">
            <h2 className="py-2 text-[18px] font-semibold">정보</h2>

            <div className="flex">
              <div>
                <Image
                  className="h-20 w-20"
                  src="/images/todo_check.png"
                  alt=""
                  width={80}
                  height={80}
                />
              </div>
              <div className="ml-4">
                <p>
                  <span className="text-sm font-bold">My To Do</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={buttonClassNames}
        title="창 닫기"
        disabled={!isActiveSettingPanel}
        onClick={() => dispatch(closeSettingPanel())}
      >
        <IconContainer size="large" iconClassName="fas fa-times" iconLabel="창 닫기" />
      </button>
    </div>
  );
}
