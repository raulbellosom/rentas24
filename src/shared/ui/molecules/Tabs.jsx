import React, { useMemo, useState } from "react";

const TabItem = () => null;

const Group = ({ children, className = "" }) => {
  const items = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (child) => React.isValidElement(child) && child.type === TabItem
      ),
    [children]
  );

  const defaultIndex = Math.max(
    0,
    items.findIndex((item) => item.props.active)
  );
  const [activeIndex, setActiveIndex] = useState(defaultIndex || 0);

  return (
    <div className={className}>
      <div className="flex w-full gap-2 overflow-x-auto border-b border-brand-200 pb-2">
        {items.map((item, index) => {
          const Icon = item.props.icon;
          const isActive = index === activeIndex;
          return (
            <button
              type="button"
              key={`${item.props.title}-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-950 text-white"
                  : "bg-brand-100/70 text-brand-700 hover:bg-brand-100"
              }`}
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              {item.props.title}
            </button>
          );
        })}
      </div>
      <div className="pt-4">{items[activeIndex]?.props.children}</div>
    </div>
  );
};

export const Tabs = {
  Group,
  Item: TabItem,
};

export default Tabs;
