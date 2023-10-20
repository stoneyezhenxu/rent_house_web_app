import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Form, CascadePicker, TextArea, ImageUploader, Toast } from 'antd-mobile';

import { axiosAPI as axios } from '../../../utils';

import Navbar from '../../../components/Navbar';
import HousePackage from '../../../components/HousePackage';

import styles from './index.module.css'

const RentAdd = () => {
    const roomTypeData = [
        { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
        { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
        { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
        { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
        { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' },
    ];

    const floorData = [
        { label: '高楼层', value: 'FLOOR|1' },
        { label: '中楼层', value: 'FLOOR|2' },
        { label: '低楼层', value: 'FLOOR|3' },
    ];

    const orientedData = [
        { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
        { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
        { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
        { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
        { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
        { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
        { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
        { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' },
    ];

    const history = useNavigate();
    const location = useLocation();

    // 设置房源信息state
    const initialHouseValue = {
        title: '',
        description: '',
        oriented: '',
        supporting: '',
        price: '',
        roomType: '',
        size: '',
        floor: '',
        community: '',
        houseImg: ''
    };
    const [houseValue, setHouseValue] = useState(initialHouseValue);

    // 进入页面时判断是否存在location.state属性，根据这个属性显示小区名称
    useEffect(() => {
        setHouseValue((prevValue) => (
            {
                ...prevValue,
                community: location.state ? location.state.id : ''
            }
        ));
    }, [location]);

    // 设置图片队列state
    const [fileList, setFileList] = useState([]);

    // 点击取消时清空房源信息和location.state，刷新页面
    const onCancel = () => {
        setHouseValue(initialHouseValue);

        location.state = null;

        history(0, { replace: true });
    };

    const onConfirm = async () => {
        // 因数据库设置原因，租金和面积非空的情况下才有返回值，否则直接提示Internal Server Error而没有返回值，所以先判断这两项是否为空
        if (!houseValue.price || !houseValue.size) {
            Toast.show({
                content: '租金和建筑面积不能为空！'
            })
        } else {
            // 先判断是否存在图片队列，如存在图片队列，先上传图片并获取服务器图片队列地址，再提交其他信息
            let houseImgs = '';

            if (fileList.length > 0) {
                const form = new FormData();

                fileList.forEach((item) => form.append('file', item.file));

                const result = await axios.post('/houses/image', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                houseImgs = result.data.body.join('|');
            }

            const res = await axios.post(('/user/houses'),
                {
                    ...houseValue,
                    houseImg: houseImgs
                }
            );

            // 根据获取到的服务器响应代码判断操作
            if (res.data.status === 200) {
                Toast.show({
                    icon: 'success',
                    content: '发布成功',
                    afterClose: () => history('/rent', { replace: true })
                });
            } else {
                Toast.show({
                    icon: 'fail',
                    content: '服务器偷懒了，请稍后再试',
                });
            }
        }
    };

    return (
        <>
            <Navbar
                title={'发布房源'}
                styles={styles}
            />
            <div className={styles.root}>
                <Form layout='horizontal'>
                    <Form.Header>房源信息</Form.Header>
                    <Form.Item
                        label="小区名称"
                        onClick={() => history('/rent/search')}
                    >
                        {location.state ? location.state.name : "请输入小区名称"}
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金"
                        extra="￥/月"
                        required
                    >
                        <Input
                            type="number"
                            placeholder='请输入租金/月'
                            value={houseValue.price}
                            onChange={(val) => setHouseValue((prevState) => (
                                {
                                    ...prevState,
                                    price: val
                                }
                            ))}
                            clearable
                        />
                    </Form.Item>
                    <Form.Item
                        name="size"
                        label="建筑面积"
                        extra="㎡"
                        required
                    >
                        <Input
                            type="number"
                            placeholder='请输入建筑面积'
                            value={houseValue.size}
                            onChange={(val) => setHouseValue((prevState) => (
                                {
                                    ...prevState,
                                    size: val
                                }
                            ))}
                            clearable
                        />
                    </Form.Item>
                    <Form.Item
                        name="roomType"
                        label="户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型"
                        trigger='onConfirm'
                        onClick={(e, pickerRef) => {
                            pickerRef.current?.open()
                        }}
                    >
                        <CascadePicker
                            options={roomTypeData}
                            value={houseValue.roomType}
                            onConfirm={(val) => setHouseValue((prevState) => (
                                {
                                    ...prevState,
                                    roomType: val[0]
                                }
                            ))}
                        >
                            {value =>
                                value.length === 0 ? '请选择' : value[0].label
                            }
                        </CascadePicker>
                    </Form.Item>
                    <Form.Item
                        name="floor"
                        label="所在楼层"
                        trigger='onConfirm'
                        onClick={(e, pickerRef) => {
                            pickerRef.current?.open()
                        }}
                    >
                        <CascadePicker
                            options={floorData}
                            value={houseValue.floor}
                            onConfirm={(val) => setHouseValue((prevState) => (
                                {
                                    ...prevState,
                                    floor: val[0]
                                }
                            ))}
                        >
                            {value =>
                                value.length === 0 ? '请选择' : value[0].label
                            }
                        </CascadePicker>
                    </Form.Item>
                    <Form.Item
                        name="oriented"
                        label="朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向"
                        trigger='onConfirm'
                        onClick={(e, pickerRef) => {
                            pickerRef.current?.open()
                        }}
                    >
                        <CascadePicker
                            options={orientedData}
                            value={houseValue.oriented}
                            onConfirm={(val) => setHouseValue((prevState) => (
                                {
                                    ...prevState,
                                    oriented: val[0]
                                }
                            ))}
                        >
                            {value =>
                                value.length === 0 ? '请选择' : value[0].label
                            }
                        </CascadePicker>
                    </Form.Item>
                </Form>
                <Form>
                    <Form.Header>房屋标题</Form.Header>
                    <Form.Item>
                        <TextArea
                            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
                            value={houseValue.title}
                            onChange={(val) => setHouseValue((prevState) => (
                                {
                                    ...prevState,
                                    title: val
                                }
                            ))}
                        />
                    </Form.Item>
                </Form>
                <Form>
                    <Form.Header>房屋图像</Form.Header>
                    <Form.Item>
                        <ImageUploader
                            value={fileList}
                            onChange={(files) => setFileList(files)}
                            upload={(file) => parseFile(file)}
                        />
                    </Form.Item>
                </Form>
                <Form>
                    <Form.Header>房屋配置</Form.Header>
                    <Form.Item className={styles.supporting}>
                        <HousePackage
                            onSelect={(value) => setHouseValue((prevValue) => (
                                {
                                    ...prevValue,
                                    supporting: value.join('|')
                                }
                            ))}
                            select
                        />
                    </Form.Item>
                </Form>
                <Form>
                    <Form.Header>房屋描述</Form.Header>
                    <Form.Item>
                        <TextArea
                            placeholder="请输入房屋描述信息"
                            rows={5}
                            value={houseValue.description}
                            onChange={(val) => setHouseValue((prevState) => (
                                {
                                    ...prevState,
                                    description: val
                                }
                            ))}
                        />
                    </Form.Item>
                </Form>
            </div>
            <div className={styles.btn}>
                <span
                    className={styles.cancel}
                    onClick={onCancel}
                >
                    取消
                </span>
                <span
                    className={styles.confirm}
                    onClick={onConfirm}
                >
                    提交
                </span>
            </div>
        </>
    );
};

export default RentAdd;


// 以下为antd-mobile v2的图像上传处理函数，来自antd-mobile v2源码，有改动
const parseFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const dataURL = e.target.result;

            if (!dataURL) {
                reject('Fail to get the image')

                return;
            }

            resolve({
                url: dataURL,
                file
            });
        };

        reader.readAsDataURL(file);
    });
};