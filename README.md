# react-native-parallax-header-view

Parallax header view for react-native.

**this repository is migrated from [this repository](https://github.com/lelandrichardson/react-native-parallax-view)**

## Installation

```bash
$ npm i react-native-header-parallax-view --save
```

## Demo

![parallax view demo](https://i.gyazo.com/e5e46d9ef4518b6a7354718947ce401d.gif)


NOTE:
- this package requires <b>React > 15.5.0</b>.If you want to use a lower version, please use [this original repository](https://github.com/lelandrichardson/react-native-parallax-view)


## Example

```jsx
<ParallaxView
    backgroundSource={require('../backgroundImage.png')}
    windowHeight={300}
    header={(
        <Text style={styles.header}>
            Header Content
        </Text>
    )}
    scrollableViewStyle={{ backgroundColor: 'red' }}
>
  <View>
    // ... scrollview content
  </View>
</ParallaxView>
```


## Props

| Prop | Required | Default  | Type | Description |
| :------------ |:---:|:---------------:| :---------------:| :-----|
| backgroundSource | YES | `null` | `object` | this style defines background image style|
| backgroundStyle | NO | `null` | `object` | the `source` prop that get's passed to the background `<Image>` component. If left blank, no background is rendered |
| header | NO | `null` | `renderable` | any content you want to render on top of the image. This content's opacity get's animated down as the scrollview scrolls up. (optional) |
| windowHeight | NO | `300` | `number` | the resting height of the header image. If 0 is passed in, the background is not rendered. |
| scrollableViewStyle | NO | `null` | `object` | this style will be mixed (overriding existing fields) with scrollable view style (view which is scrolled over the background) |
| ... | NO | | `...ScrollViewProps` | `{...this.props}` is applied on the internal `ScrollView` (excluding the `style` prop which is passed on to the outer container) |
