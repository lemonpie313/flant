import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/types/user-role.type';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optionaljwtauthguard ';

@ApiTags('카트 API')
@ApiBearerAuth()
@Controller('v1/carts')
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * 카트 생성
   * @param createCartDto
   * @param req
   * @returns
   */
  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Req() req, @Res() res) {
    const userId = req.user?.id;
    const cookies = req.cookies || {};

    const data = await this.cartService.create(createCartDto, userId, cookies);

    if (data.data.guestCart) {
      res.cookie('guestCart', JSON.stringify(data.data.guestCart), {
        maxAge: 24 * 60 * 60 * 1000, // 1일 동안 유지
      });
    }

    return res.json(data);
  }

  /**
   *
   * @returns 카트 전체 조회
   */
  @Get()
  async findAll(@Req() req, @Res() res) {
    //user가 없을 경우 null
    const userId = req.user?.id;
    const cookies = req.cookies || {};
    const guestCart = cookies['guestCart'] || null;

    const data = await this.cartService.findAll(userId, guestCart);
    return res.json(data);
  }

  /**
   * 비회원 카트 이전 테스트
   * @param req
   * @param res
   * @returns
   */
  @Post('/test')
  async notUserCartSave(@Req() req, @Res() res) {
    const userId = req.user.id;
    const cookies = req.cookies || {};

    //user 로그인 api에 로그인 성공 시 아래 코드 적용될 수 있도록 수정
    // 카트 이전 서비스 호출
    const data = await this.cartService.notUserCartSave(userId, cookies);

    // 로그인 성공 응답
    return res.json({
      status: HttpStatus.OK,
      message: '로그인 성공',
      data,
    });
  }

  /**
   * 카트 아이템 삭제
   * @param cartItemId
   * @param req
   * @param res
   * @returns
   */
  @Delete('/items/:cartItemId')
  async remove(
    @Param('cartItemId') cartItemId: string,
    @Req() req,
    @Res() res,
  ) {
    const userId = req.user?.id;
    const cookies = req.cookies || {};

    // 서비스 호출하여 로직 처리
    const data = await this.cartService.remove(userId, +cartItemId, cookies);

    // 비회원의 경우 쿠키 업데이트
    if (!userId) {
      res.cookie('guestCart', JSON.stringify(data.updateCart), {
        maxAge: 24 * 60 * 60 * 1000, // 1일 동안 유지
      });
    }
    //반환
    return res.json(data);
  }

  // /**
  //  * 상품 수량 수정
  //  * @param cartItemId
  //  * @param updateCadrDto
  //  * @param req
  //  * @param res
  //  * @returns
  //  */
  // @Patch('/items/:cartItemId')
  // async cartQuantity(
  //   @Param('cartItemId') cartItemId: string,
  //   @Body() updateCadrDto: UpdateCartDto,
  //   @Req() req,
  //   @Res() res,
  // ) {
  //   const userId = req.user?.id;
  //   const cookies = req.cookies || {};

  //   // 서비스 호출하여 로직 처리
  //   const data = await this.cartService.cartQuantity(
  //     userId,
  //     +cartItemId,
  //     cookies,
  //     updateCadrDto,
  //   );

  //   // 비회원의 경우 쿠키 업데이트
  //   if (!userId) {
  //     res.cookie('guestCart', JSON.stringify(data.data.updateCart), {
  //       maxAge: 24 * 60 * 60 * 1000, // 1일 동안 유지
  //     });
  //   }
  //   //반환
  //   return res.json({
  //     status: data.status,
  //     message: data.message,
  //     cartItemId,
  //     afterQuantity: updateCadrDto.quantity,
  //   });
  // }
}
