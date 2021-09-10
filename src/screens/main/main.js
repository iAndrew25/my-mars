import React, {Fragment} from 'react';
import {View} from 'react-native';

import Header from '../../commons/components/header/header';
import Button from '../../commons/components/button/button';
import Slideshow from '../../commons/components/slideshow/slideshow'

const data = [{
	title: 'Image 1',
	description: 'Description 1',
	imageUrl: 'https://cdn.vox-cdn.com/thumbor/jcdbx7G034Gyr_Kk03Bi2pcJHvU=/1400x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/3466428/NASA-HS201427a-HubbleUltraDeepField2014-20140603.0.jpg'
}, {
	title: 'Image 2',
	description: 'Description 2',
	imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Space_night_sky.jpg'
}, {
	title: 'Image 3',
	description: 'Description 3',
	imageUrl: 'https://images.theconversation.com/files/401762/original/file-20210519-13-awaj27.jpeg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=675.0&fit=crop'
}, {
	title: 'Image 4',
	description: 'Description 4',
	imageUrl: 'https://assets.weforum.org/project/image/IxiocZRh4f3_ucmnx3sWiKRsdD1OnzHK4CC1xqkP7xA.jpeg'
}, {
	title: 'Image 5',
	description: 'Description 5',
	imageUrl: 'https://media-exp1.licdn.com/dms/image/C4D1BAQGAO9zvVhyAqQ/company-background_10000/0/1539806088038?e=2159024400&v=beta&t=5vq2-UBGsfB5RPQaOHqFEHtmdq47wFGYL27qOMblKwc'
}];

function Main({}) {
	return (
		<Fragment>
			<Header
				left={<Button onPress={console.log} text="Undo" />}
				title="My Mars"
				right={<Button onPress={console.log} icon="heart-outlined" />}
			/>
			<View style={{padding: 16}}>
			<Slideshow data={[1,2,3,4,5,6]} />
			</View>
		</Fragment>
	);
}

export default Main;